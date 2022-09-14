import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { Comments } from './comments'
import { User } from './user'

@Entity('articles', {
  orderBy: {
    update_time: "DESC",
  }
})
export class Articles extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number

  @Column()
  title!: string

  @Column()
  content!: string

  @Column()
  views!: number

  @Column()
  create_time!: Date

  @Column()
  update_time!: Date

  @Column()
  is_delete!: number

  @ManyToOne(() => User, {
    cascade: true
  })
  @JoinColumn({ name: 'user_id'})
  user!: User

  @OneToMany(() => Comments, (comments) => comments.article)
  comments!: Comments[]
}