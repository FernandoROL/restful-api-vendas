import { RepositoryInterface } from "@/common/domain/repositories/repository.interface";
import { UserTokensModel } from "../models/uder-tokens.model";

export type CreateUserTokenProps = {
  user_id: string
}

export interface UserTokensRepository extends RepositoryInterface<UserTokensModel, CreateUserTokenProps> {
  generate(props: CreateUserTokenProps): Promise<UserTokensModel>
  findByToken(token: string): Promise<UserTokensModel>
}
