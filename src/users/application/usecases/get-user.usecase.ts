import { inject, injectable } from 'tsyringe'
import { UserOutput } from '../dtos/user-output.dto'
import { UserRepository } from '@/users/domain/repositories/users.repository'

export namespace GetUserUsecase {
  export type Input = {
    id: string
  }

  export type Output = UserOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('UsersRepository')
      private usersRepository: UserRepository,
    ) {}
      async execute(input: Input) {
        return this.usersRepository.findById(input.id)
      }
    }
  }
