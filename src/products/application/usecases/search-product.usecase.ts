import { ProductsRepository } from "@/products/domain/repositories/products.repository";
import { inject, injectable } from "tsyringe";
import { SearchInputDto } from "../dto/search-input-dto";
import { PaginateOuputMapper, PaginationOutpuDto } from "../dto/pagination-output.dto";
import { ProductModel } from "@/products/domain/models/products.models";

export namespace SearchProductUseCase {
  export type Input = SearchInputDto

  export type Output = PaginationOutpuDto<ProductModel>


  @injectable()
  export class UseCase {
    constructor(
      @inject('ProductRepository')
      private productsRepository: ProductsRepository
    ) {}

    async execute(input: Input): Promise<Output> {
      const searchResult = await this.productsRepository.search(input)
      return PaginateOuputMapper.toOutput(searchResult.items, searchResult)
    }
  }
}
