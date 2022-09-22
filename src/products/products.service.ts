import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nation } from '../common.entity';
import { Author } from '../users/users.author.entity';
import { DataSource, EntityManager, Not, Repository } from 'typeorm';
import {
  CreateProductDto,
  ModifyOpenProductDto,
  ModifyProductDto,
} from './dto/product.dto';
import {
  Product,
  ProductAsset,
  ProductDetail,
  ProductImage,
} from './products.entity';
import { ProductDetailStatus, ProductStatus } from './products.enum';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Editor } from 'src/users/users.editor.entity';
import { HttpService } from '@nestjs/axios';

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
    private readonly httpService: HttpService,
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

  findExaminingOpenProduct(pageOption: PaginateQuery) {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    queryBuilder
      .leftJoinAndSelect('product.productDetails', 'detail')
      .leftJoinAndSelect('product.productAssets', 'asset')
      .leftJoinAndSelect('detail.productImages', 'image')
      .andWhere('detail.status = :status', {
        status: ProductDetailStatus.EXAMINING,
      });

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

  async findByBuyer(pageOption: PaginateQuery, nationCode: string) {
    let nation = await this.nationRepository.findOneByOrFail({
      nationCode: nationCode,
    });

    if (!nation.isTranslatable) {
      nation = await this.nationRepository.findOneBy({
        nationCode: Nation.defaultTranslationNationCode,
      });
    }

    const queryBuilder = this.productRepository.createQueryBuilder('product');
    queryBuilder
      .leftJoinAndSelect('product.productDetails', 'detail')
      .leftJoinAndSelect('product.productAssets', 'asset')
      .leftJoinAndSelect('detail.productImages', 'image')
      .leftJoinAndSelect('detail.nation', 'nation')
      .leftJoinAndSelect('nation.exchangeRate', 'exchangeRate')
      .andWhere('product.status = :productStatus', {
        productStatus: ProductStatus.OPEN,
      })
      .andWhere('detail.status = :status', {
        status: ProductDetailStatus.USING,
      })
      .andWhere('detail.nationId = :nationId', {
        nationId: nation.id,
      });

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
    await this.productRepository.save(product);
    await this.createTranslations(product);
  }

  async createTranslations(product: Product) {
    const base = await this.detailRepository.findOneBy({
      product: { id: product.id },
    });

    const nations = await this.nationRepository.findBy({
      nationCode: Not(Nation.baseNationCode),
      isTranslatable: true,
    });

    const details = [];

    for (const nation of nations) {
      let target = nation.nationCode;
      if (target === 'cn') {
        target = 'zh-CN';
      } else if (target === 'tw') {
        target = 'zh-TW';
      }
      const titleData = {
        source: Nation.baseNationCode,
        target: target,
        text: base.title,
      };

      const descriptionData = {
        source: Nation.baseNationCode,
        target: target,
        text: base.description,
      };

      const detail = new ProductDetail();
      detail.nation = nation;
      detail.title = await this.translate(titleData);
      detail.description = await this.translate(descriptionData);
      detail.product = product;
      details.push(detail);
    }

    await this.detailRepository.save(details);
  }

  async translate(data) {
    const response = await this.httpService.axiosRef.post(
      'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation',
      data,
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': 'iopktfa4zy',
          'X-NCP-APIGW-API-KEY': 'iDChFn9WInbAYZsF1ShEMPPy9ogwdnujv2YB8tuX',
          ContentType: 'application/json',
        },
      },
    );

    return response.data.message.result.translatedText;
  }

  async requestForExamine(productId: number): Promise<void> {
    const product = await this.productRepository.findOneByOrFail({
      id: productId,
    });
    product.status = ProductStatus.EXAMINING;
    this.productRepository.save(product);
  }

  async requestForExamineOpenProduct(
    productId: number,
    nationCode: string,
  ): Promise<void> {
    const product = await this.productRepository.findOneOrFail({
      where: {
        id: productId,
        productDetails: {
          nation: { nationCode: nationCode },
          status: ProductDetailStatus.PENDING,
        },
      },
      relations: {
        productDetails: true,
      },
    });

    const detail = product.productDetails.at(0);
    detail.status = ProductDetailStatus.EXAMINING;

    this.detailRepository.save(detail);
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
        new ProductDetail().createProductDetailFrom(
          dto.title,
          dto.description,
          product,
          nation,
        ),
      );

      await transactionManager.save(
        ProductAsset.createProductAssets(dto.assetUrls, product),
      );

      await transactionManager.save(
        ProductImage.createProductImages(dto.imageUrls, productDetail),
      );
    });
  }

  async modifyOpenProduct(dto: ModifyOpenProductDto): Promise<void> {
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

    const product = await this.productRepository.findOne({
      where: {
        id: dto.productId,
        productDetails: {
          status: Not(ProductDetailStatus.USING),
          nation: { id: nation.id },
        },
      },
      relations: {
        productDetails: {
          productImages: true,
        },
      },
    });

    const detail =
      product.productDetails.length > 0
        ? product.productDetails.at(0)
        : new ProductDetail().createProductDetailFrom(
            dto.title,
            dto.description,
            product,
            nation,
            dto.modifier,
            ProductDetailStatus.PENDING,
          );

    this.dataSource.transaction(async (transactionManager: EntityManager) => {
      if (dto.imageUrls && dto.imageUrls.length > 0) {
        if (detail.productImages && detail.productImages.length > 0) {
          await transactionManager.remove(detail.productImages);
        }

        await transactionManager.save(
          ProductImage.createProductImages(dto.imageUrls, detail),
        );
      }

      await transactionManager.save(detail);
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
    const product = (
      await this.productRepository.findOneOrFail({
        where: {
          id: dto.productId,
          productDetails: {
            nation: { id: nation.id },
          },
        },
        relations: {
          productAssets: true,
          productDetails: {
            productImages: true,
          },
        },
      })
    ).modifyProduct(dto.basePrice, dto.modifier);

    const detail = product.productDetails
      .at(0)
      .modifyProductDetail(dto.title, dto.description, dto.modifier);

    this.dataSource.transaction(async (transactionManager: EntityManager) => {
      if (product.status === ProductStatus.OPEN) {
        throw new ForbiddenException();
      }

      await transactionManager.save(product);

      if (dto.assetUrls && dto.imageUrls.length > 0) {
        await transactionManager.remove(product.productAssets);
        await transactionManager.save(
          ProductAsset.createProductAssets(dto.assetUrls, detail.product),
        );
      }

      if (dto.imageUrls && dto.assetUrls.length > 0) {
        await transactionManager.remove(detail.productImages);
        await transactionManager.save(
          ProductImage.createProductImages(dto.imageUrls, detail),
        );
      }

      await transactionManager.save(detail);
    });
  }
}
