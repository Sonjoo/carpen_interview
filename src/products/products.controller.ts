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
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Nation } from 'src/common.entity';
import {
  CreateProductDto,
  ModifyOpenProductDto,
  ModifyProductDto,
  OpenProductDto,
} from './dto/product.dto';
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
    @Query('status') productStatus: ProductStatus = ProductStatus.OPEN,
  ): Promise<Paginated<Product>> {
    return this.productService.find(query, productStatus);
  }

  @Get('buyer')
  @ApiTags('buyer', 'product')
  findByBuyer(
    @Paginate() query: PaginateQuery,
    @Query('nation_code') nationCode: string = Nation.baseNationCode,
  ) {
    return this.productService.findByBuyer(query, nationCode);
  }

  @Get('exmining/open')
  @ApiTags('product')
  findExaminingOpenProduct(@Paginate() query: PaginateQuery) {
    return this.productService.findExaminingOpenProduct(query);
  }

  @Put(':id')
  @ApiTags('product')
  @ApiResponse({
    status: 204,
  })
  modifyProduct(
    @Param('id') productId: number,
    @Query('status') status: ProductStatus = ProductStatus.CREATED,
    @Body() dto: ModifyProductDto,
  ) {
    if (status === ProductStatus.OPEN) {
      const openProductDto = new ModifyOpenProductDto();
      openProductDto.setDataFrom(dto);
      this.productService.modifyOpenProduct(openProductDto);
    } else {
      this.productService.modifyProduct(dto);
    }
  }

  @Get(':id')
  @ApiTags('product')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Put(':id/status/examine')
  @ApiTags('product', 'author')
  @HttpCode(204)
  requestForExamine(
    @Param('id') id: number,
    @Query('status') status: ProductStatus = ProductStatus.CREATED,
    @Query('nation_code') nationCode: string = Nation.baseNationCode,
  ) {
    if (status === ProductStatus.OPEN) {
      this.productService.requestForExamineOpenProduct(id, nationCode);
    } else {
      this.productService.requestForExamine(id);
    }
  }

  @Put(':id/status/open')
  @HttpCode(204)
  @ApiTags('product')
  changeStatus(
    @Param('id') productId: number,
    @Body()
    body: OpenProductDto,
  ) {
    this.productService.openProduct(body.productId, body.editorId);
  }

  @Get('author/:id')
  @ApiTags('product', 'author')
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
