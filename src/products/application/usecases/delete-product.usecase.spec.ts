import 'reflect-metadata'
import { ProductsRepository } from "@/products/domain/repositories/products.repository"
import { ProductsInMemoryRepository } from "@/products/infrastructure/in-memory/repositories/products-in-memory.repository"
import { NotFoundError } from '@/common/domain/error/bot-found-error'
import { DeleteProductUseCase } from './delete-product.usecase'
import { ProductsDataBuilder } from '@/products/infrastructure/testing/helpers/products-data-builder'

describe('DeleteProductUseCase Unit Test', () => {
  let sut: DeleteProductUseCase.UseCase
  let repository: ProductsInMemoryRepository

  beforeEach(() => {
    repository = new ProductsInMemoryRepository()
    sut = new DeleteProductUseCase.UseCase(repository)
  })

  it('Should delete a product by id', async () => {
    const spyDelete = jest.spyOn(repository, 'delete')
    const product = await repository.insert(ProductsDataBuilder({}))

    expect(repository.items.length).toBe(1)

    await sut.execute({ id: product.id })
    expect(spyDelete).toHaveBeenCalledTimes(1)
    expect(repository.items.length).toBe(0)
  })

  it('should throw error when product not found', async () => {
    const id = "Fake-id"

    await expect(sut.execute({ id: id })).rejects.toThrow(NotFoundError)

    await expect(sut.execute({ id: id })).rejects.toThrow(
      new NotFoundError(`Model not found using id ${id}`)
    )
  })
})
