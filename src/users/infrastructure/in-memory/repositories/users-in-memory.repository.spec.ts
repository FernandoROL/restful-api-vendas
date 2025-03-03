import { NotFoundError } from "@/common/domain/error/bot-found-error"
import { UsersInMemoryRepository } from "./users-in-memory.repository"
import { UserDataBuilder } from "../../testing/helpers/user-data-builder"
import { ConflictError } from "@/common/domain/error/conflict-error"


describe('UsersInMemoryRepository Unit Tests', () => {
  let sut: UsersInMemoryRepository

  beforeEach(() => {
    sut = new UsersInMemoryRepository()
    sut.items = []
  })

  describe('findByEmail', () => {
    it('should throw error when user not found', async () => {
      await expect(() => sut.findByEmail('a@a.com')).rejects.toBeInstanceOf(
        NotFoundError,
      )
      await expect(sut.findByEmail('a@a.com')).rejects.toThrow(
        new NotFoundError('User not found using email a@a.com'),
      )
    })

    it('should find a user by email', async () => {
      const user = UserDataBuilder({ email: 'a@a.com' })
      await sut.insert(user)
      const result = await sut.findByEmail(user.email)
      expect(result).toStrictEqual(user)
    })
  })

  describe('findByName', () => {
    it('should throw error when user not found', async () => {
      await expect(() => sut.findByName('John Doe')).rejects.toBeInstanceOf(
        NotFoundError,
      )
      await expect(sut.findByName('John Doe')).rejects.toThrow(
        new NotFoundError('User not found using name John Doe'),
      )
    })

    it('should find a user by name', async () => {
      const user = UserDataBuilder({ name: 'John Doe' })
      await sut.insert(user)
      const result = await sut.findByName(user.name)
      expect(result).toStrictEqual(user)
    })
  })

  describe('conflictingEmail', () => {
    it('should throw error when user found', async () => {
      const user = UserDataBuilder({ email: 'a@a.com' })
      await sut.insert(user)
      await expect(sut.conflictingEmail('a@a.com')).rejects.toThrow(
        ConflictError,
      )
      await expect(sut.conflictingEmail('a@a.com')).rejects.toThrow(
        new ConflictError('Email already used on another user'),
      )
    })

    it('should not find a user by email', async () => {
      expect.assertions(0)
      await sut.conflictingEmail('a@a.com')
    })
  })

  describe('applyFilter', () => {
    it('should no filter items when filter object is null', async () => {
      const user = UserDataBuilder({})
      sut.insert(user)
      const spyFilter = jest.spyOn(sut.items, 'filter' as any)

      const filteredItems = await sut['applyFilter'](sut.items, null as any)
      expect(spyFilter).not.toHaveBeenCalled()
      expect(filteredItems).toStrictEqual(sut.items)
    })

    it('should filter name field using filter parameter', async () => {
      const items = [
        UserDataBuilder({ name: 'Test' }),
        UserDataBuilder({ name: 'TEST' }),
        UserDataBuilder({ name: 'fake' }),
      ]
      sut.items = items
      const spyFilter = jest.spyOn(sut.items, 'filter' as any)

      const filteredItems = await sut['applyFilter'](sut.items, 'TEST')
      expect(spyFilter).toHaveBeenCalledTimes(1)
      expect(filteredItems).toStrictEqual([sut.items[0], sut.items[1]])
    })
  })

  describe('applySort', () => {
    it('should sort by created_at when sort param is null', async () => {
      const created_at = new Date()
      const items = [
        UserDataBuilder({
          name: 'c',
          created_at: created_at,
        }),
        UserDataBuilder({
          name: 'a',
          created_at: new Date(created_at.getTime() + 100),
        }),
        UserDataBuilder({
          name: 'b',
          created_at: new Date(created_at.getTime() + 200),
        }),
      ]
      sut.items = items
      const sortedItems = await sut['applySort'](sut.items, null, null)
      expect(sortedItems).toStrictEqual([
        sut.items[2],
        sut.items[1],
        sut.items[0],
      ])
    })

    it('should sort by name field', async () => {
      const items = [
        UserDataBuilder({ name: 'c' }),
        UserDataBuilder({ name: 'b' }),
        UserDataBuilder({ name: 'a' }),
      ]
      sut.items = items

      let sortedItems = await sut['applySort'](sut.items, 'name', 'asc')
      expect(sortedItems).toStrictEqual([
        sut.items[2],
        sut.items[1],
        sut.items[0],
      ])

      sortedItems = await sut['applySort'](sut.items, 'name', 'desc')
      expect(sortedItems).toStrictEqual([
        sut.items[0],
        sut.items[1],
        sut.items[2],
      ])
    })

    it('should sort by email field', async () => {
      const items = [
        UserDataBuilder({ email: 'c@a.com' }),
        UserDataBuilder({ email: 'b@a.com' }),
        UserDataBuilder({ email: 'a@a.com' }),
      ]
      sut.items = items

      let sortedItems = await sut['applySort'](sut.items, 'email', 'asc')
      expect(sortedItems).toStrictEqual([
        sut.items[2],
        sut.items[1],
        sut.items[0],
      ])

      sortedItems = await sut['applySort'](sut.items, 'email', 'desc')
      expect(sortedItems).toStrictEqual([
        sut.items[0],
        sut.items[1],
        sut.items[2],
      ])
    })
  })
})
