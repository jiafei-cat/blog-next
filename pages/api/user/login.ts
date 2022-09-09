import type { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironSessionOptions } from 'config'
import { ISession } from '..'
import getConnection from 'db'
import { User, UserAuth } from 'db/entity'
import { Repository } from 'typeorm'
import { API_STATUS_CODE } from 'pages/enum'
import { Cookie } from 'next-cookie'
import { setCookie } from 'utils'

type Data = {
  code: number
  data: null
  message: string
}

async function login (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { phone, verifyCode } = req.body
  const connection = await getConnection() // 链接数据库
  const userAuthRepository = await connection.getRepository(UserAuth) // 获取userAuth表
  
  const session:ISession = req.session
  const isPhoneLogin = !!verifyCode

  const sessionVerifyCode = String(session?.verifyCode)
  const identify_type = isPhoneLogin ? 'phone' : 'password'

  const cookie = Cookie.fromApiRoute(req, res) // 将cookies带入request/response

  const _sessionVerifyCode = (process.env.TEST_VERIFY_CODE || sessionVerifyCode)
  console.log(`[logger] session verify code is [${_sessionVerifyCode}]`)
  // 验证码错误
  if(verifyCode !== _sessionVerifyCode) {
    res.status(200).json({
      code: API_STATUS_CODE.ERROR_VERITY_CODE,
      data: null,
      message: '验证码校验错误'
    })
    return
  } 

  if(_sessionVerifyCode === verifyCode) {
    let userAuth = await userAuthRepository.findOne({
      where: {
        identify_type,
        identifier: phone,
      },
      relations: ['user']
    })
    const isNewUser = !userAuth

    if (isNewUser) {
      console.log('register new user')
      const result = await registerUser({
        phone,
        verifyCode: sessionVerifyCode,
        userAuthRepository,
        identify_type,
      })
      console.log('register result')
      console.log(result)

      // 注册失败
      if (!result?.id) {
        res.status(200).json({
          code: API_STATUS_CODE.REGISTER_ERROR,
          data: null,
          message: 'register failed'
        })
        return
      }

      userAuth = result
    }

    // 再加一层判断，避免获取不到用户信息的情况
    if (!userAuth?.user) {
      return
    }

    console.log('login')
    const { id, avatar, nickname } = userAuth.user
    session.userId = id
    session.avatar = avatar
    session.nickname = nickname
    await session.save()

    setCookie(cookie, { id, avatar, nickname })

    res.status(200).json({
      code: API_STATUS_CODE.SUCCESS,
      data: userAuth.user,
      message: isNewUser ? 'register success' : 'login success'
    })
  }
}

async function registerUser({
  phone,
  verifyCode,
  identify_type,
  userAuthRepository,
}: {
  phone: string
  verifyCode: string
  identify_type: string
  userAuthRepository: Repository<UserAuth>
}) {
  const user = new User()
  user.nickname = `用户_${Math.ceil(Math.random() * 10000)}`
  user.avatar = '/images/avatar.jpeg'
  user.job = '暂无'
  user.introduce = '暂无'

  const userAuth = new UserAuth()
  userAuth.identifier = phone
  userAuth.credential = verifyCode
  userAuth.user = user // 关联user
  userAuth.identify_type = identify_type

  return await userAuthRepository.save(userAuth)
}

export default withIronSessionApiRoute(login, ironSessionOptions)