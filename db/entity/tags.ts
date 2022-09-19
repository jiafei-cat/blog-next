import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Articles } from "./articles";
import { User } from "./user";


@Entity('tags')
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number
  
  @Column()
  title!: string

  @Column()
  key!: string

  @Column()
  icon!: string
  
  @Column()
  follow_count!: number

  @Column()
  article_count!: number

  @ManyToMany(() => User, {
    cascade: true
  })
  @JoinTable({
    name: 'tags_user_rel',
    joinColumn: {
      name: 'tag_id'
    },
    inverseJoinColumn: {
      name: 'user_id'
    }
  })
  users!: User[]

  @ManyToMany(() => Articles, (article) => article.tags)
  @JoinTable({
    name: 'articles_tags_rel',
    joinColumn: {
      name: 'tag_id'
    },
    inverseJoinColumn: {
      name: 'article_id'
    }
  })
  articles!: Articles[]
}