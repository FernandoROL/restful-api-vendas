import 'reflect-metadata'
import { AuthenticateUserUseCase } from './authenticate-user.usecase'
import { UsersInMemoryRepository } from '@/users/infrastructure/in-memory/repositories/users-in-memory.repository'
import { HashProvider } from '@/common/domain/providers/hash-provider'
import { InvalidCredentialsError } from '@/common/domain/error/invalid-credentials-error'
import { NotFoundError } from '@/common/domain/error/bot-found-error'
import { BcryptHashProvider } from '@/common/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { UserDataBuilder } from '@/users/infrastructure/testing/helpers/user-data-builder'

describe('AuthenticateUserUseCase Unit Tests', () => {
  let sut: AuthenticateUserUseCase.UseCase
  let repository: UsersInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UsersInMemoryRepository()
    hashProvider = new BcryptHashProvider()
    sut = new AuthenticateUserUseCase.UseCase(repository, hashProvider)
  })

  it('should authenticate a user', async () => {
    const spyFindByEmail = jest.spyOn(repository, 'findByEmail')
    await repository.insert(
      UserDataBuilder({
        email: 'a@a.com',
        password: await hashProvider.generateHash('123456'),
      }),
    )

    const result = await sut.execute({
      email: 'a@a.com',
      password: '123456',
    })
    expect(result.email).toEqual('a@a.com')
    expect(spyFindByEmail).toHaveBeenCalledTimes(1)
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'a@a.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await repository.insert(
      UserDataBuilder({
        email: 'a@a.com',
        password: await hashProvider.generateHash('123456'),
      }),
    )

    await expect(() =>
      sut.execute({
        email: 'a@a.com',
        password: 'fake',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
