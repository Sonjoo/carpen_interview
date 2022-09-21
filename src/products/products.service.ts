import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nation } from '../common.entity';
import { Author } from '../users/users.author.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateProductDto, ModifyProductDto } from './dto/product.dto';
import {
  Product,
  ProductAsset,
  ProductDetail,
  ProductImage,
} from './products.entity';
import { ProductStatus } from './products.enum';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Editor } from 'src/users/users.editor.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Nation)
    private readonly nationRepository: Repository<Nation>,
    @InjectRepository(Editor)
    private readonly editorRepository: Repository<Editor>,
    @InjectRepository(ProductDetail)
    private readonly detailRepository: Repository<ProductDetail>,
    @InjectRepository(ProductAsset)
    private readonly assetRepository: Repository<ProductAsset>,
    @InjectRepository(ProductImage)
    private readonly imageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  findOne(id: number): Promise<Product> {
    return this.productRepository.findOneOrFail({
      where: {
        id: id,
      },
      relations: {
        author: true,
        productDetails: {
          productImages: true,
          nation: true,
        },
        productAssets: true,
      },
    });
  }

  find(
    pageOption: PaginateQuery,
    status: ProductStatus,
  ): Promise<Paginated<Product>> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    queryBuilder
      .leftJoinAndSelect('product.productDetails', 'detail')
      .leftJoinAndSelect('product.productAssets', 'asset')
      .leftJoinAndSelect('detail.productImages', 'image');

    if (status !== null && status !== undefined) {
      queryBuilder.andWhere('product.status = :status', { status: status });
    }

    return paginate(pageOption, queryBuilder, {
      sortableColumns: ['id', 'status'],
    });
  }

  findByAuthor(
    authorId: number,
    pageOption: PaginateQuery,
    status?: ProductStatus,
  ): Promise<Paginated<Product>> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    queryBuilder
      .leftJoinAndSelect('product.productDetails', 'detail')
      .leftJoinAndSelect('product.productAssets', 'asset')
      .leftJoinAndSelect('detail.productImages', 'image')
      .where('product.authorId = :authorId', { authorId: authorId });

    if (status !== null && status !== undefined) {
      queryBuilder.andWhere('product.status = :status', { status: status });
    }

    return paginate(pageOption, queryBuilder, {
      sortableColumns: ['id', 'status'],
    });
  }

  async openProduct(productId: number, editorId: number) {
    const product = await this.productRepository.findOneByOrFail({
      id: productId,
    });
    const editor = await this.editorRepository.findOneByOrFail({
      id: editorId,
    });

    product.status = ProductStatus.OPEN;
    product.editor = editor;
    this.productRepository.save(product);
  }

  async requestForExamine(id: number) {
    const product = await this.productRepository.findOneByOrFail({ id: id });
    product.status = ProductStatus.EXAMINING;
    this.productRepository.save(product);
  }

  async createProduct(dto: CreateProductDto) {
    const author = await this.authorRepository.findOneByOrFail({
      id: dto.authorId,
    });

    const nation = await this.nationRepository.findOneBy({
      nationCode: Nation.baseNationCode,
    });

    this.dataSource.transaction(async (transactionManager: EntityManager) => {
      const product = await transactionManager.save(
        new Product().createFromDto(dto, author),
      );
      const productDetail = await transactionManager.save(
        new ProductDetail().createProductDetailFrom(dto, product, nation),
      );

      await transactionManager.save(
        ProductAsset.createProductAssets(dto.assetUrls, product),
      );

      await transactionManager.save(
        ProductImage.createProductImages(dto.imageUrls, productDetail),
      );
    });
  }

  async modifyProduct(dto: ModifyProductDto): Promise<void> {
    let nation: Nation;
    if (dto.nationId) {
      nation = await this.nationRepository.findOneByOrFail({
        id: dto.nationId,
      });
    } else {
      nation = await this.nationRepository.findOneByOrFail({
        nationCode: Nation.baseNationCode,
      });
    }

    const detail = (
      await this.detailRepository.findOneOrFail({
        where: { product: { id: dto.productId }, nation: { id: nation.id } },
        relations: {
          product: true,
        },
      })
    ).modifyProductDetail(dto.title, dto.description, dto.modifier);

    this.dataSource.transaction(async (transactionManager: EntityManager) => {
      const product = (
        await this.productRepository.findOneBy({
          id: dto.productId,
        })
      ).modifyProduct(dto.basePrice, dto.modifier);

      await transactionManager.save(product);

      if (dto.assetUrls && dto.assetUrls.length > 0) {
        const oldAssets = await this.assetRepository.findBy({
          product: { id: dto.productId },
        });

        await transactionManager.remove(oldAssets);
        await transactionManager.save(
          ProductAsset.createProductAssets(dto.assetUrls, detail.product),
        );
      }

      if (dto.imageUrls && dto.assetUrls.length > 0) {
        const oldImages = await this.imageRepository.findBy({
          productDetail: { id: detail.id },
        });

        await transactionManager.remove(oldImages);
        await transactionManager.save(
          ProductImage.createProductImages(dto.imageUrls, detail),
        );
      }

      await transactionManager.save(detail);
    });
  }
}
