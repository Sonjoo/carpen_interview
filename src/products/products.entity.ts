import { Author } from '../users/users.author.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import {
  ProductDetailStatus,
  ProductModifier,
  ProductStatus,
} from './products.enum';
import { Nation } from '../common.entity';
import { Editor } from 'src/users/users.editor.entity';
import { CreateProductDto } from './dto/product.dto';

@Entity()
export class Fee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  basePrice: number;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.CREATED,
  })
  status: ProductStatus;

  @Column({
    type: 'enum',
    enum: ProductModifier,
    default: ProductModifier.AUTHOR,
  })
  lastModifiedBy: ProductModifier;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToOne(() => Fee)
  @JoinColumn()
  fee: Fee;

  @OneToMany(() => ProductAsset, (productAsset) => productAsset.product)
  productAssets: ProductAsset[];

  @OneToMany(() => ProductDetail, (productDetail) => productDetail.product)
  productDetails: ProductDetail[];

  @ManyToOne(() => Author, (Author) => Author.products)
  author: Author;

  @ManyToOne(() => Editor, (editor) => editor.products, { nullable: true })
  editor: Editor | null;

  createFromDto(dto: CreateProductDto, author: Author): Product {
    this.basePrice = dto.basePrice;
    this.author = author;

    return this;
  }

  modifyProduct(basePrice: number, modifier: ProductModifier): Product {
    this.lastModifiedBy = modifier;

    if (basePrice) {
      this.basePrice = basePrice;
    }

    return this;
  }
}

@Entity()
@Unique(['product', 'nation', 'status'])
export class ProductDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ProductDetailStatus,
    default: ProductDetailStatus.USING,
  })
  status: ProductDetailStatus;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ProductModifier,
    default: ProductModifier.AUTHOR,
  })
  lastModifiedBy: ProductModifier;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => ProductImage, (productImage) => productImage.productDetail)
  productImages: ProductImage[] | null;

  @ManyToOne(() => Product, (product) => product.productDetails)
  product: Product;

  @ManyToOne(() => Nation, (nation) => nation.productDetails)
  nation: Nation;

  createProductDetailFrom(
    title: string,
    description: string,
    product: Product,
    nation: Nation,
    modifier?: ProductModifier,
    status?: ProductDetailStatus,
  ) {
    this.product = product;
    this.title = title;
    this.description = description;
    this.nation = nation;
    if (modifier) {
      this.lastModifiedBy = modifier;
    }
    if (status) {
      this.status = status;
    }
    return this;
  }

  modifyProductDetail(
    title: string,
    description: string,
    modifier: ProductModifier,
  ): ProductDetail {
    this.title = title ? title : this.title;
    this.description = description ? description : this.title;
    this.lastModifiedBy = modifier;
    return this;
  }
}

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(
    () => ProductDetail,
    (productDetail) => productDetail.productImages,
  )
  productDetail: ProductDetail;

  static createProductImages(
    urls: string[],
    productDetail: ProductDetail,
  ): ProductImage[] {
    const images = [];
    for (const url of urls) {
      const image = new ProductImage();
      image.url = url;
      image.productDetail = productDetail;
      images.push(image);
    }

    return images;
  }
}

@Entity()
export class ProductAsset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Product, (product) => product.productAssets)
  product: Product;

  static createProductAssets(urls: string[], product: Product): ProductAsset[] {
    const assets = [];
    for (const url of urls) {
      const asset = new ProductAsset();
      asset.product = product;
      asset.url = url;
      assets.push(asset);
    }

    return assets;
  }
}
