import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number

  @Column()
  nickname!: string

  @Column()
  job!: string

  @Column()
  avatar!: string

  @Column()
  introduce!: string
}
