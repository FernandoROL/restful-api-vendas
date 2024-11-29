import { testDataSource } from "@/common/infrastructure/typeorm/testing/data-source"
import { ProductsTypeormRepository } from "./products-typeorm.repository"
import { Product } from "../entities/products.entity"
import { NotFoundError } from "@/common/domain/error/bot-found-error"
import { env } from "process"
import { randomUUID } from "crypto"
import { ProductsDataBuilder } from "../../testing/helpers/products-data-builder"

describe('ProductsTypeormRepository integration tests', () => {
  let ormRepository: ProductsTypeormRepository

  beforeAll(async () => {
    await testDataSource.initialize()
  })

  afterAll(async () => {
    await testDataSource.destroy()
  })

  beforeEach(async () => {
    await testDataSource.manager.query("DELETE FROM products")
    ormRepository = new ProductsTypeormRepository()
    ormRepository.productsRepository = testDataSource.getRepository(Product)
  })

  describe('findById', () => {
    it('should generate an error when product not found', async () => {
      const id = randomUUID()
      await expect(ormRepository.findById(id)).rejects.toThrow(
        new NotFoundError(`Product not found using id ${id}`)
      )
    })

    it('should find product by its id', async () => {
      const data = ProductsDataBuilder({})
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      const result = await ormRepository.findById(product.id)
      expect([result.id, result.name]).toEqual(
        [product.id, product.name]
      )
    })
  })

  describe('crete', () => { 
    it('should create na new product object', () => {
      const data = ProductsDataBuilder({name: "product 1"})
      const result = ormRepository.create(data)

      expect(result.name).toEqual(data.name)
    })
   })

   describe('insert', () => { 
    it('should insert a new object', async () => {
      const data = ProductsDataBuilder({name: "product 1"})
      const result = await ormRepository.insert(data)

      expect(result.name).toEqual(data.name)
    })
   })

   describe('update', () => { 
    it('should generate an error when product not found', async () => {
      const data = ProductsDataBuilder({})
      await expect(ormRepository.update(data)).rejects.toThrow(
        new NotFoundError(`Product not found using id ${data.id}`)
      )
    })

    it('should update an existing object', async () => {
      const data = ProductsDataBuilder({})
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)
      product.name = 'updated name'

      const result = await ormRepository.update(product)

      expect(result.name).toEqual(product.name)
    })
   })

   describe('delete', () => { 
    it('should generate an error when product not found', async () => {
      const data = ProductsDataBuilder({})
      await expect(ormRepository.delete(data.id)).rejects.toThrow(
        new NotFoundError(`Product not found using id ${data.id}`)
      )
    })

    it('should update an existing object', async () => {
      const data = ProductsDataBuilder({})
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      await ormRepository.delete(data.id)
      const result = await testDataSource.manager.findOneBy(Product, { id: data.id })

      expect(result).toBeNull()
    })
   })

   describe('findByName', () => {
    it('should generate an error when name not found', async () => {
      const name = "Aoba"
      await expect(ormRepository.findByName(name)).rejects.toThrow(
        new NotFoundError(`Product not found using name ${name}`)
      )
    })

    it('should find product by its name', async () => {
      const data = ProductsDataBuilder({
        name: "Fernando"
      })
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      const result = await ormRepository.findByName(data.name)
      expect([result.name, result.id]).toEqual(
        [product.name, product.id]
      )
    })
  })

})
