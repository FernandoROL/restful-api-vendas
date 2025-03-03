import { inject, injectable } from 'tsyringe'
import { UserModel } from '@/users/domain/models/users.model'
import { SearchInputDto } from '@/products/application/dto/search-input-dto'
import { PaginateOuputMapper, PaginationOutpuDto } from '@/products/application/dto/pagination-output.dto'
import { UserRepository } from '@/users/domain/repositories/users.repository'

export namespace SearchUserUseCase {
  export type Input = SearchInputDto

  export type Output = PaginationOutpuDto<UserModel>

  @injectable()
  export class UseCase {
    constructor(
      @inject('UsersRepository')
      private usersRepository: UserRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const searchResult = await this.usersRepository.search(input)
      return PaginateOuputMapper.toOutput(searchResult.items, searchResult)
    }
  }
}
