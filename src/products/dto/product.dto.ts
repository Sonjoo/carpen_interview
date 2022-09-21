import { ApiProperty } from '@nestjs/swagger';
import { ProductModifier } from '../products.enum';

export class CreateProductDto {
  @ApiProperty({
    example: 1,
    description: '작가 id',
  })
  authorId!: number;

  @ApiProperty({
    example: '테스트 작품 제목',
  })
  title!: string;

  @ApiProperty({
    example: '테스트 작품 상세 설명',
  })
  description!: string;

  @ApiProperty({
    example: ['testurllink'],
    description: '실제 상품 파일의 url',
  })
  assetUrls!: Array<string>;

  @ApiProperty({
    example: ['testurllink'],
    description: '상품 상세 설명상 추가되는 file의 url',
  })
  imageUrls!: Array<string>;

  @ApiProperty({
    example: 1000,
    description: '상품가격',
  })
  basePrice!: number;
}

export class ModifyProductDto {
  @ApiProperty({
    example: '1',
    description: '수정 대상 상품 id',
  })
  productId: number;

  @ApiProperty({
    example: '테스트 작품 제목',
    required: false,
  })
  title?: string;

  @ApiProperty({
    example: '테스트 작품 상세 설명',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 1,
    description: '수정하려는 상품 상세의 언어',
    required: false,
  })
  nationId: number;

  @ApiProperty({
    example: ['testurllink'],
    description: '상품 상세 설명상 추가되는 file의 url',
    required: false,
  })
  imageUrls?: string[];

  @ApiProperty({
    example: ['testurllink'],
    description: '상품 상세 설명상 추가되는 file의 url',
    required: false,
  })
  assetUrls?: string[];

  @ApiProperty({
    example: 1000,
    description: '상품가격',
    required: false,
  })
  basePrice?: number;

  @ApiProperty({
    example: 1,
    enum: ProductModifier,
    required: true,
  })
  modifier: ProductModifier;
}

export class ModifyOpenProductDto {
  @ApiProperty({
    example: '1',
    description: '수정 대상 상품 id',
  })
  productId: number;

  @ApiProperty({
    example: '테스트 작품 제목',
    required: false,
  })
  title?: string;

  @ApiProperty({
    example: '테스트 작품 상세 설명',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 1,
    description: '수정하려는 상품 상세의 언어',
    required: false,
  })
  nationId: number;

  @ApiProperty({
    example: ['testurllink'],
    description: '상품 상세 설명상 추가되는 file의 url',
    required: false,
  })
  imageUrls?: string[];

  @ApiProperty({
    example: 1,
    enum: ProductModifier,
    required: true,
  })
  modifier: ProductModifier;

  setDataFrom(dto: ModifyProductDto): void {
    this.description = dto.description;
    this.imageUrls = dto.imageUrls;
    this.modifier = dto.modifier;
    this.nationId = dto.nationId;
    this.productId = dto.productId;
    this.title = dto.title;
  }
}
