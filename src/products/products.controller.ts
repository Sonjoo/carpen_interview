import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { CreateProductDto } from './dto/product.dto';
import { Product } from './products.entity';
import { ProductStatus } from './products.enum';
import { ProductService } from './products.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(204)
  create(@Body() createDto: CreateProductDto) {
    this.productService.createProduct(createDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Put(':id/examine')
  @HttpCode(204)
  requestForExamine(@Param('id') id: number) {
    this.productService.requestForExamine(id);
  }

  @Get('author/:id')
  findByAuthor(
    @Paginate() query: PaginateQuery,
    @Param('id') authorId: number,
    @Query('status') status: ProductStatus = null,
  ): Promise<Paginated<Product>> {
    return this.productService.findByAuthor(authorId, query, status);
  }
}
