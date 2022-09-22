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
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dealBasR: number;

  @Column()
  curUnit: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Nation, (nation) => nation.exchangeRate)
  nations: Nation[];
}

@Entity()
export class Nation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nationCode: string;

  @Column({
    default: true,
  })
  isTranslatable: boolean;

  @OneToMany(() => ProductDetail, (productDetail) => productDetail.nation)
  productDetails: ProductDetail[];

  @ManyToOne(() => ExchangeRate, (exchangeRate) => exchangeRate.nations)
  exchangeRate: ExchangeRate;

  static baseNationCode = 'ko';
  static defaultTranslationNationCode = 'en';
}
