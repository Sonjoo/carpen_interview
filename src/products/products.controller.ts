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

  @Get()
  find(
    @Paginate() query: PaginateQuery,
    @Query('status') status: ProductStatus = ProductStatus.OPEN,
  ): Promise<Paginated<Product>> {
    return this.productService.find(query, status);
  }

  @Put(':id/examine')
  @HttpCode(204)
  requestForExamine(@Param('id') id: number) {
    this.productService.requestForExamine(id);
  }

  @Put('open')
  @HttpCode(204)
  openProduct(@Body() body: { productId: number; editorId: number }) {
    this.productService.openProduct(body.productId, body.editorId);
  }

  @Get('author/:id')
  findByAuthor(
    @Paginate() query: PaginateQuery,
    @Param('id') authorId: number,
    @Query('status') status: ProductStatus,
  ): Promise<Paginated<Product>> {
    return this.productService.findByAuthor(authorId, query, status);
  }
}
