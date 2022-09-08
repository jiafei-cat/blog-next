interface ICookieInfo {
  id: number
  nickname: string
  avatar: string
}

const expires = new Date(Date.now() + 24 *  60 * 60)
const path = '/'

const commonOptions = {
  path,
  expires,
}

export const setCookie = (cookies: any, {
  id,
  nickname,
  avatar
}: ICookieInfo) => {

  cookies.set('userId', id, commonOptions)
  cookies.set('nickname', nickname, commonOptions)
  cookies.set('avatar', avatar, commonOptions)
}

export const clearCookie = (cookies: any) => {
  cookies.set('userId', '', commonOptions)
  cookies.set('nickname', '', commonOptions)
  cookies.set('avatar', '', commonOptions)
};
