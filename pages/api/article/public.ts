import { ironSessionOptions } from 'config'
import getConnection from 'db'
import { Articles, Tag, User } from 'db/entity'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { API_STATUS_CODE } from 'types/enum'
import { ISession } from '..'

async function publicArticle(req: NextApiRequest, res: NextApiResponse) {
  const session:ISession = req.session
  const { title, content, tagsList } = req.body

  if (!session?.userId) {
    res.status(200).json({
      code: API_STATUS_CODE.NOT_LOGIN,
      data: null,
      message: `用户未登录`
    })
    return
  }

  if (!title || !content) {
    res.status(200).json({
      code: API_STATUS_CODE.MISS_REQUIRED_PARAMETERS,
      data: null,
      message: `Miss required parameters ${!title ? 'title' : 'content'}`
    })
    return
  }
  const connection = await getConnection()
  const userRepository = connection.getRepository(User)
  const articleRepository = connection.getRepository(Articles)
  const tagsRepository = connection.getRepository(Tag)
  const user = await userRepository.findOne({
    where: {
      id: session.userId
    }
  })

  if (!user) {
    res.status(200).json({
      code: API_STATUS_CODE.UNKNOW_ERROR,
      data: null,
      message: '未知错误'
    })
    return
  }

  const article = new Articles() 
  article.title = title
  article.content = content
  article.create_time = new Date()
  article.update_time = new Date()
  article.is_delete = 0
  article.views = 0
  article.user = user

  const targetTagsList = await tagsRepository.find({
    where: (tagsList as string[]).map(i => ({ id: Number(i) }))
  })

  if (targetTagsList?.length) {
    article.tags = targetTagsList?.map(i => {
      i.article_count += 1
      return i
    }) || []
  }

  const saveResult = await articleRepository.save(article)

  if (!saveResult?.id) {
    res.status(200).json({
      code: API_STATUS_CODE.UNKNOW_ERROR,
      data: null,
      message: '未知错误'
    })
    return
  }

  res.status(200).json({
    code: API_STATUS_CODE.SUCCESS,
    data: saveResult.id,
    message: 'success'
  })
}

export default withIronSessionApiRoute(publicArticle, ironSessionOptions)
