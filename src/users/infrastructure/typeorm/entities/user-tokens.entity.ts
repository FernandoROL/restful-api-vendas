import { UserTokensModel } from "@/users/domain/models/uder-tokens.model"
import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity('user-tokens')
export class UserToken implements UserTokensModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  @Generated('uuid')
  token: string

  @Column()
  user_id: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
