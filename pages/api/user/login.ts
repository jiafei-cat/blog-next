import type { NextApiRequest, NextApiResponse } from 'next'
import { format } from 'date-fns'
import md5 from 'md5'
import { encode } from 'js-base64'
import request from 'service/fetch'
import websiteConfig from 'website.config.json'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config'
import { ISession } from '..'
import getConnection from 'db'
import { User, UserAuth } from 'db/entity'
import { Repository } from 'typeorm'
import { API_STATUS_CODE } from 'pages/enum'

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
  const connection = await getConnection()
  const userRepository = await connection.getRepository(User)
  const userAuthRepository = await connection.getRepository(UserAuth)
  
  const session:ISession = req.session
  const isPhoneLogin = !!verifyCode

  const sessionVerifyCode = String(session?.verifyCode)
  const identify_type = isPhoneLogin ? 'phone' : 'password'

  /** 验证码错误 */
  if(sessionVerifyCode !== verifyCode) {
    res.status(200).json({
      code: API_STATUS_CODE.ERROR_VERITY_CODE,
      data: null,
      message: '验证码校验错误'
    })
    return
  }

  if(sessionVerifyCode === verifyCode) {
    const userAuth = await userAuthRepository.findOne({
      where: {
        identify_type,
        identifier: phone,
      },
      relations: ['user']
    })

    const isNewUser = !userAuth

    if (isNewUser) {
      await registerUser({
        phone,
        verifyCode: sessionVerifyCode,
        userAuthRepository,
        identify_type,
      })
    } else {
      console.log('login')
      session.userId = userAuth.user.id
      session.avatar = userAuth.user.avatar
      session.nickname = userAuth.user.nickname

      await session.save()

      res.status(200).json({
        code: API_STATUS_CODE.SUCCESS,
        data: userAuth.user,
        message: 'success'
      })
    }
  }
  // res = res.status(200)
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

  const result = await userAuthRepository.save(userAuth)
  console.log(result)
}

export default withIronSessionApiRoute(login, ironOptions)