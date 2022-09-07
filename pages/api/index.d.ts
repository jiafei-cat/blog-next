import { IronSession } from 'iron-session'

export type ISession = IronSession & {
  verifyCode?: number
  userId?: number
  avatar?: string
  nickname?: string
}
