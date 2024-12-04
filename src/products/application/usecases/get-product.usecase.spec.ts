import 'reflect-metadata'
import { ProductsRepository } from "@/products/domain/repositories/products.repository"
import { GetProductUseCase } from "./get-product.usecase"
import { ProductsInMemoryRepository } from "@/products/infrastructure/in-memory/repositories/products-in-memory.repository"
import { NotFoundError } from '@/common/domain/error/bot-found-error'

describe('GetProductUseCase Unit Test', () => {
  let sut: GetProductUseCase.UseCase
  let repository: ProductsRepository

  beforeEach(() => {
    repository = new ProductsInMemoryRepository()
    sut = new GetProductUseCase.UseCase(repository)
  })

  it('Should find a product by id', async () => {
    const spyFindById = jest.spyOn(repository, 'findById')
    const props = {
      name: 'Product 1',
      price: 10,
      quantity: 6
    }

    const model = repository.create(props)
    await repository.insert(model)

    const result = await sut.execute({ id: model.id })
    expect(result).toMatchObject(model)
    expect(spyFindById).toHaveBeenCalledTimes(1)
  })

  it('should throw error when product not found', async () => {
    await expect(sut.execute({ id: "fake-id" })).rejects.toBeInstanceOf(NotFoundError)
  })
})
