import { ironSessionOptions } from 'config'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { ISession } from '..'
import { API_STATUS_CODE } from 'types/enum'
import getConnection from 'db'
import { User } from 'db/entity'

async function updateUserInfo(req: NextApiRequest, res: NextApiResponse) {
  const session:ISession = req.session
  if (!session?.userId) {
    res.status(200).json({
      code: API_STATUS_CODE.NOT_LOGIN,
      data: null,
      message: '用户未登录'
    })
    return
  }

  const connection = await getConnection()
  const userRepository = await connection.getRepository(User)

  const targetUser = await userRepository.findOne({
    where: {
      id: Number(session.userId)
    }
  })

  if (!targetUser) {
    res.status(200).json({
      code: API_STATUS_CODE.UNKNOW_ERROR,
      data: null,
      message: '未知错误'
    })
    return
  }

  const { nickname, job, introduce  } = req.body
  targetUser.nickname = nickname
  targetUser.job = job
  targetUser.introduce = introduce

  const saveResult = await userRepository.save(targetUser)

  if (!saveResult.id) {
    res.status(200).json({
      code: API_STATUS_CODE.UNKNOW_ERROR,
      data: null,
      message: '未知错误'
    })
    return
  }

  res.status(200).json({
    code: API_STATUS_CODE.SUCCESS,
    data: saveResult,
    message: 'success'
  })
}

export default withIronSessionApiRoute(updateUserInfo, ironSessionOptions)