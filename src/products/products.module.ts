import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nation } from 'src/common.entity';
import { Author } from 'src/users/users.author.entity';
import { Editor } from 'src/users/users.editor.entity';
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
      Nation,
      Editor,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductsModule {}
