import 'reflect-metadata'
import { ProductsRepository } from "@/products/domain/repositories/products.repository"
import { GetProductUseCase } from "./get-product.usecase"
import { ProductsInMemoryRepository } from "@/products/infrastructure/in-memory/repositories/products-in-memory.repository"
import { NotFoundError } from '@/common/domain/error/bot-found-error'
import { AllProductUseCase } from './all-product.usecase'

describe('AllProductUseCase Unit Test', () => {
  let sut: AllProductUseCase.UseCase
  let repository: ProductsRepository

  beforeEach(() => {
    repository = new ProductsInMemoryRepository()
    sut = new AllProductUseCase.UseCase(repository)
  })

  it('should list all products', async () => {
    const spyFindAll = jest.spyOn(repository, 'findAll')
    const props =
    {
      name: 'Product 1',
      price: 10,
      quantity: 6
    }


    const model = repository.create(props)
    await repository.insert(model)

    const result = await sut.execute()
    expect(result).toMatchObject([model])
    expect(spyFindAll).toHaveBeenCalledTimes(1)
  })
})
