import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/product.dto';
import { ProductService } from './products.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(204)
  create(@Body() createDto: CreateProductDto) {
    this.productService.createProduct(createDto);
  }
}
