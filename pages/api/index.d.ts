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
}