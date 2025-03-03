import { ProductModel } from "@/products/domain/models/products.models";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class Product implements ProductModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('decimal')
  price: number;

  @Column('int')
  quantity: number;

  @CreateDateColumn({name: 'created_at'})
  created_at: Date;

  @CreateDateColumn({name: 'updated_at'})
  updated_at: Date;
}
