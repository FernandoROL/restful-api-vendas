import 'reflect-metadata'
import { ProductsRepository } from "@/products/domain/repositories/products.repository"
import { UpdateProductUseCase } from "./update-product.usecase"
import { ProductsInMemoryRepository } from "@/products/infrastructure/in-memory/repositories/products-in-memory.repository"
import { NotFoundError } from '@/common/domain/error/bot-found-error'
import { ProductsDataBuilder } from '@/products/infrastructure/testing/helpers/products-data-builder'
import { ConflictError } from '@/common/domain/error/conflict-error'

describe('UpdateProductUseCase Unit Test', () => {
  let sut: UpdateProductUseCase.UseCase
  let repository: ProductsRepository

  beforeEach(() => {
    repository = new ProductsInMemoryRepository()
    sut = new UpdateProductUseCase.UseCase(repository)
  })

  it('Should update a product with the given parameters', async () => {
    const spyUpdate = jest.spyOn(repository, 'update')
    const props = {
      name: 'Product 1',
      price: 10,
      quantity: 6
    }

    const model = repository.create(props)
    await repository.insert(model)

    const newData = {
      id: model.id,
      name: 'Updated Name',
      price: 500,
      quantity: 20
    }

    const result = await sut.execute(newData)
    expect(result.name).toEqual(newData.name)
    expect(result.price).toEqual(newData.price)
    expect(result.quantity).toEqual(newData.quantity)
    expect(spyUpdate).toHaveBeenCalledTimes(1)
  })

  it('should throw error when product not found', async () => {
    await expect(sut.execute({ id: "fake-id" })).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be possible to register a product with the name of another product', async () => {
    const product1 = repository.create(
      ProductsDataBuilder({ name: 'Product 1' }),
    )
    await repository.insert(product1)
    const props = {
      name: 'Product 2',
      price: 10,
      quantity: 5,
    }
    const model = repository.create(props)
    await repository.insert(model)
    const newData = {
      id: model.id,
      name: 'Product 1',
      price: 500,
      quantity: 20,
    }
    await expect(sut.execute(newData)).rejects.toBeInstanceOf(ConflictError)
  })
})

//   it('should throw error when name not provided', async () => {
//     const props = {
//       name: null,
//       price: 20,
//       quantity: 5
//     }

//     await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
//   })

//   it('should throw error when price not provided', async () => {
//     const props = {
//       name: "Product 1",
//       price: null,
//       quantity: 5
//     }

//     await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
//   })

//   it('should throw error when quantity not provided', async () => {
//     const props = {
//       name: 'Product 1',
//       price: 20,
//       quantity: null
//     }

//     await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
//   })
// })
