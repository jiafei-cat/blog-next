import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { User } from './user'

@Entity({ name: 'user_auths' })
export class UserAuth extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number

  @ManyToOne(() => User, {
    cascade: true, // 使用联级自动保存
  })
  @JoinColumn({ name: 'user_id'})
  user!: User

  @Column()
  identify_type!: string

  @Column()
  identifier!: string

  @Column()
  credential!: string
}