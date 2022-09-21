import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductDetail } from './products/products.entity';

@Entity()
export class Nation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nationCode: string;

  @Column()
  isTranslatable: boolean;

  @OneToMany(() => ProductDetail, (productDetail) => productDetail.nation)
  productDetails: ProductDetail[];

  @OneToMany(() => ExchangeRate, (exchangeRate) => exchangeRate.nation)
  exchangeRates: ExchangeRate[];
}

@Entity()
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dealBasR: number;

  @Column()
  curUnit: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Nation, (nation) => nation.exchangeRates)
  nation: Nation;
}
