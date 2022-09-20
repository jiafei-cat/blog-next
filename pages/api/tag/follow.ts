import { ironSessionOptions } from 'config'
import getConnection from 'db'
import { Tag, User } from 'db/entity'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { API_STATUS_CODE } from 'types/enum'
import { ISession } from '..'

async function followTag(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session
  const { type, id } = req.body
  const isFollowTag = type === 'follow'

  if (!session.userId) {
    res.status(200).json({
      code: API_STATUS_CODE.NOT_LOGIN,
      data: null,
      message: '未登录',
    })
    return
  }
  if (!id) {
    res.status(200).json({
      code: API_STATUS_CODE.MISS_REQUIRED_PARAMETERS,
      data: null,
      message: '缺少必要参数',
    })
    return
  }

  const connection = await getConnection()
  const tagRepository = await connection.getRepository(Tag)
  const userRepository = await connection.getRepository(User)
  const targetTagData = await tagRepository.findOne({
    relations: ['users'],
    where: {
      id,
    }
  })

  const targetUser = await userRepository.findOne({
    where: {
      id: session.userId
    }
  })

  if (!targetTagData?.id || !targetUser?.id) {
    res.status(200).json({
      code: API_STATUS_CODE.UNKNOW_ERROR,
      data: null,
      message: '未知错误',
    })
    return
  }

  if (isFollowTag) {
    targetTagData.users = (targetTagData.users || []).concat([targetUser])
    targetTagData.follow_count += 1
  } else {
    targetTagData.users =  targetTagData.users.filter(i => i.id !== targetUser.id)
    targetTagData.follow_count -= 1
  }

  const saveResult = await tagRepository.save(targetTagData)

  if (!saveResult.id) {
    res.status(200).json({
      code: API_STATUS_CODE.UNKNOW_ERROR,
      data: null,
      message: '未知错误',
    })
    return
  }

  res.status(200).json({
    code: API_STATUS_CODE.SUCCESS,
    data: saveResult,
    message: 'success',
  })
  return
}

export default withIronSessionApiRoute(followTag, ironSessionOptions)