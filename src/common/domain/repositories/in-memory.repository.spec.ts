import { randomUUID } from "crypto"
import { InMemoryRepository } from "./in-memory.repository"
import { NotFoundError } from "../error/bot-found-error"

type StubModelProps = {
  id: string
  name: string
  price: number
  created_at: Date
  updated_at: Date
}

class StubInMemoryRepository extends InMemoryRepository<StubModelProps> {

  constructor() {
    super()
    this.sortableFields = ['name']
  }

  protected async applyFilter(items: StubModelProps[], filter: string | null): Promise<StubModelProps[]> {
    if (!filter) return items
    return items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()),
    )
  }
}

describe('InMemoryRepository unit tests', () => {
  let sut: StubInMemoryRepository
  let model: StubModelProps
  let props: any
  let updated_at: Date
  let created_at: Date

  beforeEach(() => {
    sut = new StubInMemoryRepository()
    created_at = new Date()
    updated_at = new Date()
    props = {
      name: 'test name',
      price: 10,
    }
    model = {
      id: randomUUID(),
      created_at,
      updated_at,
      ...props,
    }
  })

  describe('create', () => {
    it('should create a new model', () => {
      const result = sut.create(props)
      expect(result.name).toStrictEqual('test name')
    })
  })

  describe('insert', () => {
    it('should insert a new model', async () => {
      const result = await sut.insert(model)
      expect(result).toStrictEqual(sut.items[0])
    })
  })

  describe('findById', () => {
    it('should throw an id not found error', async () => {
      await expect(sut.findById('fake_id')).rejects.toThrow(
        new NotFoundError('Model not found using id fake_id'),
      )
    })

    it("should find a model by its id", async () => {
      const data = await sut.insert(model)
      const result = await sut.findById(data.id)
      expect(result).toStrictEqual(sut.items[0])
    })
  })

  describe('update', () => {
    it('should throw an id not found error', async () => {
      await expect(sut.update(model)).rejects.toThrow(
        new NotFoundError('Model not found using id ' + model.id),
      )
    })

    it('should update a model by its id', async () => {
      const data = await sut.insert(model)
      const modelUpdated = {
        id: data.id,
        name: 'updated name',
        price: 199.99,
        created_at,
        updated_at
      }
      const result = await sut.update(modelUpdated)
      expect(result).toStrictEqual(sut.items[0])
    })
  })


  describe('delete', () => {
    it('should throw an id not found error', async () => {
      await expect(sut.delete(model.id)).rejects.toThrow(
        new NotFoundError('Model not found using id ' + model.id),
      )
    })
    it('should delete a model', async () => {
      const data = await sut.insert(model)
      expect(sut.items.length).toBe(1)
      const result = await sut.findById(data.id)
      expect(result).toStrictEqual(data)
      await sut.delete(data.id)
      expect(sut.items.length).toBe(0)
    })
  })

  describe('applyFilter', () => {
    it('should not filter items if the filter query is null', async () => {
      const item = [model]
      const spyFilter = jest.spyOn(item, 'filter' as any)
      const result = await sut['applyFilter'](item, null)
      expect(spyFilter).not.toHaveBeenCalled()
      expect(result).toStrictEqual(item)
    })

    it('should filter data using a filter parameter', async () => {
      const item = [
        { id: randomUUID(), name: 'testerrr', price: 10, created_at, updated_at },
        { id: randomUUID(), name: 'testeee', price: 20, created_at, updated_at },
        { id: randomUUID(), name: 'lalala', price: 30, created_at, updated_at },
      ]

      const spyFilter = jest.spyOn(item, 'filter' as any)
      let result = await sut['applyFilter'](item, 'TEST')
      expect(spyFilter).toHaveBeenCalledTimes(1)
      expect(result).toStrictEqual([item[0], item[1]])

      result = await sut['applyFilter'](item, 'test')
      expect(spyFilter).toHaveBeenCalledTimes(2)
      expect(result).toStrictEqual([item[0], item[1]])

      result = await sut['applyFilter'](item, 'no-filter')
      expect(spyFilter).toHaveBeenCalledTimes(3)
      expect(result).toHaveLength(0)
    })
  })

  describe('applySort', () => {
    it('should not sort items', async () => {
      const items = [
        { id: randomUUID(), name: 'b', price: 10, created_at, updated_at },
        { id: randomUUID(), name: 'a', price: 20, created_at, updated_at },
        { id: randomUUID(), name: 'c', price: 30, created_at, updated_at },
      ]

      let result = await sut['applySort'](items, null, null)
      expect(result).toStrictEqual(items)
    })
    it('should sort items', async () => {
      const items = [
        { id: randomUUID(), name: 'b', price: 10, created_at, updated_at },
        { id: randomUUID(), name: 'a', price: 20, created_at, updated_at },
        { id: randomUUID(), name: 'c', price: 30, created_at, updated_at },
      ]

      let result = await sut['applySort'](items, 'name', 'desc')
      expect(result).toStrictEqual([items[2], items[0], items[1]])
    })
  })

  describe('applyPaginate', () => {
    it('should paginate items', async () => {
      const items = [
        { id: randomUUID(), name: 'b', price: 10, created_at, updated_at },
        { id: randomUUID(), name: 'a', price: 20, created_at, updated_at },
        { id: randomUUID(), name: 'c', price: 30, created_at, updated_at },
        { id: randomUUID(), name: 'e', price: 20, created_at, updated_at },
        { id: randomUUID(), name: 'd', price: 30, created_at, updated_at },
      ]

      let result = await sut['applyPaginate'](items, 1, 2)
      expect(result).toStrictEqual([items[0], items[1]])

      result = await sut['applyPaginate'](items, 2, 2)
      expect(result).toStrictEqual([items[2], items[3]])

      result = await sut['applyPaginate'](items, 3, 2)
      expect(result).toStrictEqual([items[4]])

      result = await sut['applyPaginate'](items, 1, 4)
      expect(result).toStrictEqual([items[0], items[1], items[2], items[3]])
    })
  })

  describe('search', () => {
    it('should paginate items', async () => {
      const items = Array(16).fill(model)

      sut.items = items
      let result = await sut.search({})
      expect(result).toStrictEqual({
        items: Array(15).fill(model),
        total: 16, 
        current_page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null
      })
    })
  })
})
