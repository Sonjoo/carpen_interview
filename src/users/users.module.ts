import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './users.author.entity';
import { Buyer } from './users.buyer.entity';
import { Editor } from './users.editor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Editor, Buyer])],
})
export class UsersModule {}
