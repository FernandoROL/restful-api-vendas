import { dataSource } from '@/common/infrastructure/typeorm'
import { UsersTypeormRepository } from '../typeorm/repositories/user-typeorm.repository'
import { container } from 'tsyringe'
import { User } from '../typeorm/entities/users.entity'
import { CreateUserUseCase } from '@/users/application/usecases/create-user.usecase'
import { SearchUserUseCase } from '@/users/application/usecases/search-user.usecase'
import { AuthenticateUserUseCase } from '@/users/application/usecases/authenticate-user.usecase'
import { UpdateAvatarUseCase } from '@/users/application/usecases/update-avatar.usecase'
import { UserTokensTypeormRepository } from '../typeorm/repositories/user-tokens-typeorm.repository'
import { UserToken } from '../typeorm/entities/user-tokens.entity'
import { SendResetPasswordEmailUsecase } from '@/users/application/usecases/send-reset-password-email.usecase'
import { ResetPasswordUseCase } from '@/users/application/usecases/resetPassword.usecase'
import { GetUserUsecase } from '@/users/application/usecases/get-user.usecase'

container.registerSingleton('UsersRepository', UsersTypeormRepository)
container.registerInstance(
  'UsersDefaultRepositoryTypeorm',
  dataSource.getRepository(User),
)
container.registerSingleton(
  'UserTokensTypeormRepository',
  UserTokensTypeormRepository,
)
container.registerInstance(
  'UserTokensDefaultTypeormRepository',
  dataSource.getRepository(UserToken),
)

container.registerSingleton('CreateUserUseCase', CreateUserUseCase.UseCase)
container.registerSingleton('SearchUserUseCase', SearchUserUseCase.UseCase)
container.registerSingleton(
  'AuthenticateUserUseCase',
  AuthenticateUserUseCase.UseCase,
)
container.registerSingleton('UpdateAvatarUseCase', UpdateAvatarUseCase.UseCase)
container.registerSingleton('SendResetPasswordEmailUsecase', SendResetPasswordEmailUsecase.UseCase)
container.registerSingleton('ResetPasswordUseCase', ResetPasswordUseCase.UseCase)
container.registerSingleton('GetUserUsecase', GetUserUsecase.UseCase)
