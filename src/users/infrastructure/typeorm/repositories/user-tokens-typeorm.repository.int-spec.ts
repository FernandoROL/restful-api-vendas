import { testDataSource } from '@/common/infrastructure/typeorm/testing/data-source'
import { UserTokensRepository } from '@/users/domain/repositories/user-tokens.repository'
import { UserRepository } from '@/users/domain/repositories/users.repository'
import { UserTokensTypeormRepository } from './user-tokens-typeorm.repository'
import { UserToken } from '../entities/user-tokens.entity'
import { User } from '../entities/users.entity'
import { UsersTypeormRepository } from './user-typeorm.repository'
import { randomUUID } from 'crypto'
import { NotFoundError } from '@/common/domain/error/bot-found-error'
import { UserDataBuilder } from '../../testing/helpers/user-data-builder'

describe('UserTokensTypeormRepository Integration Tests', () => {
  let userTokensRepository: UserTokensRepository
  let usersRepository: UserRepository
  let typeormEntityManager: any

  beforeAll(async () => {
    await testDataSource.initialize()
    typeormEntityManager = testDataSource.createEntityManager()
  })

  afterAll(async () => {
    await testDataSource.destroy()
  })

  beforeEach(async () => {
    await testDataSource.manager.query('DELETE FROM user_tokens')
    usersRepository = new UsersTypeormRepository(
      typeormEntityManager.getRepository(User),
    )
    userTokensRepository = new UserTokensTypeormRepository(
      typeormEntityManager.getRepository(UserToken),
      usersRepository,
    )
  })

  it('should throw error on generate UserToken when a user not found', async () => {
    const data = { user_id: randomUUID() }
    await expect(() =>
      userTokensRepository.generate(data),
    ).rejects.toBeInstanceOf(NotFoundError)
    await expect(userTokensRepository.generate(data)).rejects.toThrow(
      new NotFoundError(`User not found using ID ${data.user_id}`),
    )
  })

  it('should generate a new UserToken', async () => {
    const userData = UserDataBuilder({ name: 'John Doe', email: 'a@a.com' })
    const user = await usersRepository.insert(userData)

    const data = {
      user_id: user.id,
    }
    const result = await userTokensRepository.generate(data)

    expect(result.id).toBeDefined()
    expect(result.token).toBeDefined()
    expect(result.user_id).toEqual(data.user_id)
  })

  it('should throw error when token not found', async () => {
    const token = randomUUID()
    await expect(() =>
      userTokensRepository.findByToken(token),
    ).rejects.toBeInstanceOf(NotFoundError)
    await expect(userTokensRepository.findByToken(token)).rejects.toThrow(
      new NotFoundError(`User token not found`),
    )
  })

  it('should finds a UserToken by token', async () => {
    const userData = UserDataBuilder({ name: 'John Doe', email: 'a@a.com' })
    const user = await usersRepository.insert(userData)

    const data = {
      user_id: user.id,
    }
    const userToken = await userTokensRepository.generate(data)

    const result = await userTokensRepository.findByToken(userToken.token)
    expect(result).toMatchObject(userToken)
  })
})
