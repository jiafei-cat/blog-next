import getConnection from "db"
import { Articles } from "db/entity"
import { NextApiRequest, NextApiResponse } from "next"
import { API_STATUS_CODE } from "types/enum"

const getArticleList  = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tag } = req.query
  const connection = await getConnection()
  const articleRepository = connection.getRepository(Articles)

  const query = tag ? {
    tags: {
      key: tag as string | undefined
    }
  } : {

  }
  const articles = await articleRepository.find({
    relations: ['user', 'tags'],
    where: query
  })

  res.status(200).json({
    data: articles,
    code: API_STATUS_CODE.SUCCESS,
    message: 'success'
  })
}

export default getArticleList