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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { CreateProductDto, ModifyProductDto } from './dto/product.dto';
import { Product } from './products.entity';
import { ProductStatus } from './products.enum';
import { ProductService } from './products.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(204)
  @ApiTags('product')
  create(@Body() createDto: CreateProductDto) {
    this.productService.createProduct(createDto);
  }

  @Get()
  @ApiTags('product')
  find(
    @Paginate() query: PaginateQuery,
    @Query('status') status: ProductStatus = ProductStatus.OPEN,
  ): Promise<Paginated<Product>> {
    return this.productService.find(query, status);
  }

  @Put(':id')
  @ApiTags('product')
  modifyProduct(@Body() dto: ModifyProductDto) {
    this.productService.modifyProduct(dto);
  }

  @Get(':id')
  @ApiTags('product')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Put(':id/examine')
  @ApiTags('product')
  @HttpCode(204)
  requestForExamine(@Param('id') id: number) {
    this.productService.requestForExamine(id);
  }

  @Put('open')
  @HttpCode(204)
  @ApiTags('product')
  openProduct(@Body() body: { productId: number; editorId: number }) {
    this.productService.openProduct(body.productId, body.editorId);
  }

  @Get('author/:id')
  @ApiTags('product')
  @ApiResponse({
    status: 200,
    description: '작가를 기준으로 상품을 조회한다',
  })
  findByAuthor(
    @Paginate() query: PaginateQuery,
    @Param('id') authorId: number,
    @Query('status') status: ProductStatus,
  ): Promise<Paginated<Product>> {
    return this.productService.findByAuthor(authorId, query, status);
  }
}
