import getConnection from 'db'
import { Articles, Tag } from 'db/entity'
import { NextApiRequest, NextApiResponse } from 'next'
import { API_STATUS_CODE } from 'types/enum'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironSessionOptions } from 'config'
import { ISession } from '..'

async function updateArticle(req: NextApiRequest, res: NextApiResponse) {
  const { id, title, content, tagsList = [] } = req.body
  const connection = await getConnection()
  const articleRepository = connection.getRepository(Articles)
  const tagsListRepository = connection.getRepository(Tag)

  const targetArticleItem = await articleRepository.findOne({
    where: { id },
    relations: ['user', 'tags']
  })

  // 查询tag表中符合id的tagsList
  const targetTagsList = tagsList?.length ? await tagsListRepository.find({
    where: (tagsList as string[]).map(i => ({ id: Number(i)}))
  }) || [] : []

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

  if (targetTagsList?.length) {
    // 需要移除的tags
    const needRemoveTags = targetArticleItem.tags.filter(i => !(targetTagsList.map(i => i.id).includes(i.id)))
    const existedTags = targetArticleItem.tags.map(i => i.id)
    
    // 移除的tag article_count - 1
    const singleTags = needRemoveTags.map(i => {
      i.article_count -= 1
      return i
    })

    // 保存被移除掉的tag
    const subtractResult = await tagsListRepository.save(singleTags)

    // 新的tag article_count + 1
    const newTagsList = targetTagsList.map(i => {
      if (!existedTags.includes(i.id)) {
        i.article_count += 1
      }
      return i
    })

    targetArticleItem.tags = newTagsList
  }

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
