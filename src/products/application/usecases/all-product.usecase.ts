import { ProductsRepository } from "@/products/domain/repositories/products.repository"
import { inject, injectable } from "tsyringe"
import { ProductOutput } from "../dto/product-output.dto"

export namespace AllProductUseCase {
  export type Output = ProductOutput
  @injectable()
  export class UseCase {
    constructor(
      @inject('ProductRepository')
      private productsRepository: ProductsRepository
    ) { }

    async execute(): Promise<Output[]> {
      const product: ProductOutput[] = await this.productsRepository.findAll()
      return product
    }
  }
}
