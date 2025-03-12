import { UserModel } from "@/users/domain/models/users.model";
import { Exclude, Expose } from "class-transformer";
import { env } from "@/common/infrastructure/env";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User implements UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  @Exclude()
  password: string

  @Column()
  @Exclude()
  avatar?: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @Expose({name: 'avatar_url'})
  getAvatarUrl() {
    if(!this.avatar) return "No avatar image set"

    return `${env.CLOUDFLARE_R2_URL}/${this.avatar}`
  }
}
