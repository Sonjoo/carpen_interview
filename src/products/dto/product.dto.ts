import { ApiProperty } from '@nestjs/swagger';

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
  productId: number;
  title?: string;
  description?: string;
  nationId: number;
  imageUrls?: string[];
  basePrice?: number;
  assetUrls?: string[];
}
