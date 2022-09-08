export interface IUserInfo {
  id?: number | null
  nickname?: string
  avatar?: string
  introduce?: string
  job?: string
}

export interface IUserStore {
  userInfo: IUserInfo
  setUserInfo: (value: IUserInfo) => void
}

const userStore = ():IUserStore => {
  return {
    userInfo: { },
    setUserInfo (value) {
      this.userInfo = value
    }
  }
}

export default userStore