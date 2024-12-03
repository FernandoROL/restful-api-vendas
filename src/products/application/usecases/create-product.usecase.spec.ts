import { ProductsRepository } from "@/products/domain/repositories/products.repository"
import { CreateProductUseCase } from "./create-product.usecase"
import { ProductsInMemoryRepository } from "@/products/infrastructure/in-memory/repositories/products-in-memory.repository"
import { ConflictError } from "@/common/domain/error/conflict-error"
import { BadRequestError } from "@/common/domain/error/bad-request-error"

describe('CreateProductUseCase Unit Test', () => {
  let sut: CreateProductUseCase.UseCase
  let repository: ProductsRepository

  beforeEach(() => {
    repository = new ProductsInMemoryRepository()
    sut = new CreateProductUseCase.UseCase(repository)
  })

  it('Should create a product', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = {
      name: 'Product 1',
      price: 10,
      quantity: 6
    }

    const result = await sut.execute(props)
    expect(result.id).toBeDefined()
    expect(result.created_at).toBeDefined()
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('should not be possible to register a product with the name of another product', async () => {
    const props = {
      name: 'Product 1',
      price: 20,
      quantity: 5
    }

    await sut.execute(props)
    await expect(sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
  })

  it('should throw error when name not provided', async () => {
    const props = {
      name: null,
      price: 20,
      quantity: 5
    }

    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should throw error when price not provided', async () => {
    const props = {
      name: "Product 1",
      price: null,
      quantity: 5
    }

    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should throw error when quantity not provided', async () => {
    const props = {
      name: 'Product 1',
      price: 20,
      quantity: null
    }

    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })
})
