import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Articles } from './articles'
import { User } from './user'

@Entity('comments', {
  orderBy: {
    create_time: "DESC",
  }
})
export class Comments extends BaseEntity  {
  @PrimaryGeneratedColumn()
  readonly id!: number

  @Column()
  content!: string

  @Column()
  create_time!: Date

  @Column()
  is_delete!: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User

  @ManyToOne(() => Articles)
  @JoinColumn({ name: 'article_id' })
  article!: Articles
}