import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from 'src/users/users.author.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/product.dto';
import { Product } from './products.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  async createProduct(dto: CreateProductDto) {
    const author = await this.authorRepository.findOneByOrFail({
      id: dto.authorId,
    });
    this.productRepository.save(new Product().createFromDto(dto, author));
  }
}
