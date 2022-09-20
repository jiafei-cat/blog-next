import { ironSessionOptions } from 'config'
import getConnection from 'db'
import { Tag } from 'db/entity'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { API_STATUS_CODE } from 'types/enum'
import { ISession } from '..'

async function getTags(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session

  const connection = await getConnection()
  const tagsRepository = await connection.getRepository(Tag)
  const tagsListData = await tagsRepository.find({
    relations: ['users'],
  }) as (Tag & {
    isFollow: number
    follow_count: number
  })[]

  const follow = await tagsRepository.find({
    relations: ['users'],
    where: {
      users: {
        id: session?.userId || 0
      }
    }
  })

  const userFollowId = follow.map(i => i.id)
  tagsListData.forEach(i => {
    i.follow_count = i.users?.length || 0
    i.isFollow = userFollowId.includes(i.id) ? 1 : 0
  })

  res.status(200).json({
    code: API_STATUS_CODE.SUCCESS,
    data: tagsListData || [],
    message: 'success',
  })
}

export default withIronSessionApiRoute(getTags, ironSessionOptions)