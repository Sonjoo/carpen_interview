import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from 'src/users/users.author.entity';
import { ProductController } from './products.controller';
import {
  Fee,
  Product,
  ProductAsset,
  ProductDetail,
  ProductImage,
} from './products.entity';
import { ProductService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductAsset,
      ProductDetail,
      ProductImage,
      Fee,
      Author,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductsModule {}
