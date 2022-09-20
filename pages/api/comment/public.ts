import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironSessionOptions } from 'config'
import { ISession } from '..'
import { API_STATUS_CODE } from 'types/enum'
import getConnection from 'db'
import { Comments } from 'db/entity/'
import { Articles, User } from 'db/entity'

async function commentPublic(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session
  if (!session?.userId) {
    res.status(200).json({
      code: API_STATUS_CODE.NOT_LOGIN,
      data: null,
      message: '未登录'
    })
    return
  }

  const { id, content } = req.body

  if (!id || !content) {
    res.status(200).json({
      code: API_STATUS_CODE.MISS_REQUIRED_PARAMETERS,
      data: null,
      message: '缺少必要参数'
    })
    return
  }

  const connection = await getConnection()
  const commentRepository = await connection.getRepository(Comments)
  const articleRepository = await connection.getRepository(Articles)
  const userRepository = await connection.getRepository(User)

  const targetArticle = await articleRepository.findOne({
    where: { id }
  })

  const targetUser = await userRepository.findOne({
    where: { id: session.userId }
  })

  if (!targetArticle?.id || !targetUser?.id) {
    res.status(200).json({
      code: API_STATUS_CODE.UNKNOW_ERROR,
      data: null,
      message: '未知错误'
    })
    return
  }

  const comment = new Comments()

  comment.content = content
  comment.is_delete = 0
  comment.create_time = new Date()
  comment.user = targetUser
  comment.article = targetArticle

  const result = await commentRepository.save(comment)

  if (!result?.id) {
    res.status(200).json({
      code: API_STATUS_CODE.UNKNOW_ERROR,
      data: null,
      message: '未知错误'
    })
    return
  }

  res.status(200).json({
    code: API_STATUS_CODE.SUCCESS,
    data: result,
    message: 'success'
  })
}

export default withIronSessionApiRoute(commentPublic, ironSessionOptions)
