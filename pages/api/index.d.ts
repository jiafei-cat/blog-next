import { IronSession } from 'iron-session'
import { IUserInfo } from 'store/userStore'

export type ISession = IronSession & {
  verifyCode?: number
  userId?: number
  avatar?: string
  nickname?: string
}

export interface IArticle {
  title: string
  content: string
  user: IUserInfo
  create_time: Date
  update_time: Date
  id: number
  is_delete: number
  views: number
  comments: IComment[]
  tags: ITag[]
}

export interface IComment {
  content: string
  create_time: Date
  id: number
  user: IUserInfo
}

export interface ITag {
  id: number
  title: string
  icon: string
  follow_count: number
  article_count: number
  follow_count: number
  isFollow: number
  key: string
}