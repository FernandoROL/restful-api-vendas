import { BadRequestError } from '@/common/domain/error/bad-request-error'
import { HashProvider } from '@/common/domain/providers/hash-provider'
import { UserTokensRepository } from '@/users/domain/repositories/user-tokens.repository'
import { UserRepository } from '@/users/domain/repositories/users.repository'
import { addHours, isAfter } from 'date-fns'
import { inject, injectable } from 'tsyringe'

export namespace ResetPasswordUseCase {
  export type Input = {
    token: string
    password: string
  }

  export type Output = void

  @injectable()
  export class UseCase {
    constructor(
      @inject('UsersRepository')
      private userRepository: UserRepository,
      @inject('UserTokensTypeormRepository')
      private userTokenRepository: UserTokensRepository,
      @inject('HashProvider')
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const userToken = await this.userTokenRepository.findByToken(input.token)
      const user = await this.userRepository.findById(userToken.user_id)
      const compareDate = addHours(userToken.created_at, 2)

      if (isAfter(Date.now(), compareDate)) {
        throw new BadRequestError('Token expired')
      }

      user.password = await this.hashProvider.generateHash(input.password)
      await this.userRepository.update(user)
    }
  }
}
