import { ProductModel } from "@/products/domain/models/products.models";
import { faker } from '@faker-js/faker'
import { randomUUID } from "crypto";

export function ProductsDataBuilder(props: Partial<ProductModel>): ProductModel {
  return {
    id: props.id ?? randomUUID(),
    name: props.name ?? faker.commerce.productName(),
    price: props.price ?? Number(faker.commerce.price({ min: 100, max: 1000, dec: 2})),
    quantity: props.quantity ?? faker.number.int({min: 25, max: 250}),
    created_at: props.created_at ?? new Date(),
    updated_at: props.updated_at ?? new Date()
  }
}
