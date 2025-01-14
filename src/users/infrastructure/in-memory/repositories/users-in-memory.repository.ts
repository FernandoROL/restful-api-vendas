import { NotFoundError } from "@/common/domain/error/bot-found-error";
import { ConflictError } from "@/common/domain/error/conflict-error";
import { InMemoryRepository } from "@/common/domain/repositories/in-memory.repository";
import { UserRepository } from "@/users/domain/repositories/users.repository";
import { UserModel } from "@/users/domain/models/users.model";

export class UsersInMemoryRepository 
extends InMemoryRepository<UserModel>  
implements UserRepository
{

  sortableFields: string[] = ['name', 'email', 'created_at']

  async findByEmail(email: string): Promise<UserModel> {
    const model = this.items.find(item => item.email === email)
    if (!model) {
      throw new NotFoundError(`User not found using email ${email}`)
    }
    return model
  }

  async findByName(name: string): Promise<UserModel> {
    const model = this.items.find(item => item.name === name)
    if (!model) {
      throw new NotFoundError(`User not found using name ${name}`)
    }
    return model
  }

  async conflictingEmail(email: string): Promise<void> {
    const user = this.items.find((item: any) => item.email === email)
    if (user) {
      throw new ConflictError('Email already used on another user')
    }
  }

  protected async applyFilter(
    items: UserModel[],
    filter: string,
  ): Promise<UserModel[]> {
    if (!filter) {
      return items
    }
    return items.filter(item => {
      return item.name.toLowerCase().includes(filter.toLowerCase())
    })
  }

  protected async applySort(
    items: UserModel[],
    sort: string | null,
    sortDir: string | null,
  ): Promise<UserModel[]> {
    return super.applySort(items, sort ?? 'created_at', sortDir ?? 'desc')
  }
}
