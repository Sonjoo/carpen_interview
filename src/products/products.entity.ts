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
import { ProductDetailStatus, ProductStatus } from './products.enum';
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
    const assets = [];
    for (const url of dto.assetUrls) {
      const asset = new ProductAsset();
      asset.url = url;
      assets.push(asset);
    }

    const productDetail = new ProductDetail();
    productDetail.title = dto.title;
    productDetail.description = dto.description;

    const images = [];
    for (const url of dto.imageUrls) {
      const image = new ProductImage();
      image.url = url;
      images.push(image);
    }

    productDetail.productImages = images;

    this.basePrice = dto.basePrice;
    this.author = author;
    this.productAssets = assets;
    this.productDetails = [productDetail];

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
    default: ProductDetailStatus.PENDING,
  })
  status: ProductDetailStatus;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

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
}
