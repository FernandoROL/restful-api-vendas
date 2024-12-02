import { testDataSource } from "@/common/infrastructure/typeorm/testing/data-source"
import { ProductsTypeormRepository } from "./products-typeorm.repository"
import { Product } from "../entities/products.entity"
import { NotFoundError } from "@/common/domain/error/bot-found-error"
import { env } from "process"
import { randomUUID } from "crypto"
import { ProductsDataBuilder } from "../../testing/helpers/products-data-builder"
import { ConflictError } from "@/common/domain/error/conflict-error"
import { ProductModel } from "@/products/domain/models/products.models"

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

  describe('create', () => {
    it('should create na new product object', () => {
      const data = ProductsDataBuilder({ name: "product 1" })
      const result = ormRepository.create(data)

      expect(result.name).toEqual(data.name)
    })
  })

  describe('insert', () => {
    it('should insert a new object', async () => {
      const data = ProductsDataBuilder({ name: "product 1" })
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

  describe('conflictingName', () => {
    it('should generate an error when product is found', async () => {
      const data = ProductsDataBuilder({
        name: "Fernando"
      })
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)
      await expect(ormRepository.conflictingName(data.name)).rejects.toThrow(
        new ConflictError(`Product ${data.name} already exists`)
      )
    })
  })

  describe('findAllByIds', () => {
    it("should return an empty array when cant find products", async () => {
      const ids = [
        { id: "7bb0c256-c85c-44ec-a480-78af48b2f639" },
        { id: randomUUID() }
      ]

      const result = await ormRepository.findAllByIds(ids)
      expect(result).toEqual([])
    })

    it("should find all products by their ids", async () => {
      const ids = [
        { id: "7bb0c256-c85c-44ec-a480-78af48b2f639" },
        { id: randomUUID() }
      ]

      const data = ProductsDataBuilder({ id: ids[0].id })
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      const result = await ormRepository.findAllByIds(ids)
      expect(result).toHaveLength(1)
    })
  })

  describe('search', () => {
    it('should apply pagination only when other params are null', async () => {
      const arrange = Array(16).fill(ProductsDataBuilder({}))
      arrange.map(async element => delete element.id)
      const data = testDataSource.manager.create(Product, arrange)
      await testDataSource.manager.save(data)

      const result = await ormRepository.search({
        page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null
      })

      expect(result.total).toEqual(16)
      expect(result.items.length).toEqual(15)
    })

    it('should order by created_at desc when search param are null', async () => {
      const created_at = new Date()
      const models: ProductModel[] = []
      const arrange = Array(16).fill(ProductsDataBuilder({}))
      arrange.forEach((element, index) => {
        delete element.id
        models.push({
          ...element,
          name: `Product ${index}`,
          created_at: new Date(created_at.getTime() + index)
        })
      })
      const data = testDataSource.manager.create(Product, models)
      await testDataSource.manager.save(data)

      const result = await ormRepository.search({
        page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null
      })

      expect(result.items[0].name).toEqual(`Product 15`)
      expect(result.items[14].name).toEqual(`Product 1`)
    })

    it('should apply pagination and sort results', async () => {
      const created_at = new Date()
      const models: ProductModel[] = []
      'badec'.split('').forEach((element, index) => {
        models.push({
          ...ProductsDataBuilder({}),
          name: element,
          created_at: new Date(created_at.getTime() + index)
        })
      })
      const data = testDataSource.manager.create(Product, models)
      await testDataSource.manager.save(data)

      let result = await ormRepository.search({
        page: 1,
        per_page: 3,
        sort: 'name',
        sort_dir: 'asc',
        filter: null
      })

      expect(result.items[0].name).toEqual(`a`)
      expect(result.items[1].name).toEqual(`b`)
      expect(result.items.length).toEqual(3)

      result = await ormRepository.search({
        page: 1,
        per_page: 4,
        sort: 'name',
        sort_dir: 'desc',
        filter: null
      })

      expect(result.items[0].name).toEqual(`e`)
      expect(result.items[1].name).toEqual(`d`)
      expect(result.items.length).toEqual(4)
    })

    it('should filter, paginate and sort', async () => {
      const created_at = new Date()
      const models: ProductModel[] = []
      const values = ["test", "a", "TEST", "b", "TeSt"]
      values.forEach((element, index) => {
        models.push({
          ...ProductsDataBuilder({}),
          name: element,
          created_at: new Date(created_at.getTime() + index)
        })
      })
      const data = testDataSource.manager.create(Product, models)
      await testDataSource.manager.save(data)

      let result = await ormRepository.search({
        page: 1,
        per_page: 3,
        sort: 'name',
        sort_dir: 'asc',
        filter: "TEST"
      })

      expect(result.items[0].name).toEqual(`test`)
      expect(result.items.length).toEqual(3)
      expect(result.total).toEqual(3)

      result = await ormRepository.search({
        page: 2,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: "TEST"
      })

      expect(result.items[0].name).toEqual(`TEST`)
      expect(result.items.length).toEqual(1)
      expect(result.total).toEqual(3)
    })
  })

})
