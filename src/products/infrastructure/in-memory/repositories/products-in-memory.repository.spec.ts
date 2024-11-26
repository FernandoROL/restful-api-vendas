import { NotFoundError } from '@/common/domain/error/bot-found-error'
import { ProductsInMemoryRepository } from './products-in-memory.repository'
import { ProductsDataBuilder } from '@/products/infrastructure/testing/helpers/products-data-builder'
import { ConflictError } from '@/common/domain/error/conflict-error'

describe('ProductsInMemoryRepository unit tests', () => {
  let sut: ProductsInMemoryRepository

  beforeEach(() => {
    sut = new ProductsInMemoryRepository()
  })

  describe('findByName', () => {
    it('should throw error when product not found', async () => {
      await expect(() => sut.findByName('fake_name')).rejects.toThrow(
        new NotFoundError('Product not found using name fake_name'),
      )
      await expect(() => sut.findByName('fake_name')).rejects.toBeInstanceOf(
        NotFoundError,
      )
    })

    it('should find a product by name', async () => {
      const data = ProductsDataBuilder({ name: 'Curso nodejs' })
      sut.items.push(data)
      const result = await sut.findByName('Curso nodejs')
      expect(result).toStrictEqual(data)
    })
  })
  describe('conflictingName', () => {
    it('should throw error when product found', async () => {
      const data = ProductsDataBuilder({ name: 'Curso nodejs' })
      sut.items.push(data)
      await expect(() => sut.conflictingName('Curso nodejs')).rejects.toThrow(
        new ConflictError('Name already used on another product'),
      )
      await expect(() =>
        sut.conflictingName('Curso nodejs'),
      ).rejects.toBeInstanceOf(ConflictError)
    })
    it('should not find a product by name', async () => {
      expect.assertions(0)
      await sut.conflictingName('Curso nodejs')
    })
  })

  describe('applyFilter', () => {
    it('should not filter items if the filter query is null', async () => {
      const data = ProductsDataBuilder({})
      sut.items.push(data)
      const spyFilter = jest.spyOn(sut.items, 'filter' as any)
      const result = await sut['applyFilter'](sut.items, null)
      expect(spyFilter).not.toHaveBeenCalled()
      expect(result).toStrictEqual(sut.items)
    })

    it('should filter data using a filter parameter', async () => {
      const item = [
        ProductsDataBuilder({ name: 'Test' }),
        ProductsDataBuilder({ name: 'TEST' }),
        ProductsDataBuilder({ name: 'Faker' })
      ]

      sut.items.push(...item)

      const spyFilter = jest.spyOn(sut.items, 'filter' as any)
      let result = await sut['applyFilter'](sut.items, 'TEST')
      expect(spyFilter).toHaveBeenCalledTimes(1)
      expect(result).toStrictEqual([sut.items[0], sut.items[1]])

      result = await sut['applyFilter'](sut.items, 'test')
      expect(spyFilter).toHaveBeenCalledTimes(2)
      expect(result).toStrictEqual([sut.items[0], sut.items[1]])

      result = await sut['applyFilter'](sut.items, 'no-filter')
      expect(spyFilter).toHaveBeenCalledTimes(3)
      expect(result).toHaveLength(0)
    })
  })

  describe('applySort', () => {
    it('should sort items by created_at when sort param is null', async () => {
      const created_at = new Date()

      const items = [
        ProductsDataBuilder({ name: 'Daniel', created_at: created_at }),
        ProductsDataBuilder({ name: 'Alan', created_at: new Date(created_at.getTime() + 100) }),
        ProductsDataBuilder({ name: 'Bernardo', created_at: new Date(created_at.getTime() + 300) }),
        ProductsDataBuilder({ name: 'Carlos', created_at: new Date(created_at.getTime() + 600) })
      ]

      let result = await sut['applySort'](items, null, null)
      expect(result).toStrictEqual([items[3], items[2], items[1], items[0]])
    })

    it('should sort items by name field', async () => {
      const items = [
        ProductsDataBuilder({ name: 'Bernardo' }),
        ProductsDataBuilder({ name: 'Alan' }),
        ProductsDataBuilder({ name: 'Carlos' })
      ]
      sut.items.push(...items)

      let result = await sut['applySort'](sut.items, 'name', 'asc')
      expect(result).toStrictEqual([sut.items[1], sut.items[0], sut.items[2]])
    })
  })
})
