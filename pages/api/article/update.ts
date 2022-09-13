import getConnection from 'db'
import { Articles } from 'db/entity'
import { NextApiRequest, NextApiResponse } from 'next'
import { API_STATUS_CODE } from 'pages/enum'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironSessionOptions } from 'config'
import { ISession } from '..'

async function updateArticle(req: NextApiRequest, res: NextApiResponse) {
  const { id, title, content } = req.body
  const connection = await getConnection()
  const articleRepository = connection.getRepository(Articles)
  const targetArticleItem = await articleRepository.findOne({
    where: { id },
    relations: ['user']
  })

  if (!targetArticleItem) {
    res.status(200).json({
      code: API_STATUS_CODE.MISS_REQUIRED_PARAMETERS,
      data: null,
      message: '缺少必要参数 {id}'
    })
    return
  }
  const session:ISession = req.session
  if (targetArticleItem.user.id !== session.userId) {
    res.status(200).json({
      code: API_STATUS_CODE.NO_PERMISSION,
      data: null,
      message: '权限不够'
    })
    return
  }
  targetArticleItem.title = title
  targetArticleItem.content = content
  targetArticleItem.update_time = new Date()

  const saveResult = await targetArticleItem.save()

  if (saveResult.id) {
    res.status(200).json({
      code: API_STATUS_CODE.SUCCESS,
      data: saveResult.id,
      message: 'success'
    })
  }
}

export default withIronSessionApiRoute(updateArticle, ironSessionOptions)
