import { UserRepository } from '@/users/domain/repositories/users.repository'
import { inject, injectable } from 'tsyringe'
import { UserOutput } from '../dtos/user-output.dto'
import { BadRequestError } from '@/common/domain/error/bad-request-error'
import { HashProvider } from '@/common/domain/providers/hash-provider'

export namespace UpdateProfileUseCase {
  export type Input = {
    user_id: string
    name: string
    email: string
    old_password: string
    password: string
  }

  export type Output = UserOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('UsersRepository')
      private userRepository: UserRepository,
      @inject('HashProvider')
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { email, name, user_id, old_password, password } = input

      const user = await this.userRepository.findById(user_id)

      if (user.email !== email) {
        await this.userRepository.conflictingEmail(email)
        user.email = email
      }

      if(password && !old_password) {
        throw new BadRequestError("The old password is required to update password")
      }

      if(password && old_password) {
        const checkOldPassword = await this.hashProvider.compareHash(
          old_password,
          user.password
        )
        if(!checkOldPassword) {
          throw new BadRequestError("The old password is incorrect")
        }
        user.password = await this.hashProvider.generateHash(password)
      }

      if(user.name !== name) {
        user.name = name
      }

      return this.userRepository.update(user)
    }
  }
}
