import { ironSessionOptions } from 'config'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { API_STATUS_CODE } from 'pages/enum'
import { ISession } from '..'
import getConnection from 'db'
import { User } from 'db/entity'

async function getUserInfo (req: NextApiRequest, res: NextApiResponse) {
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
  // const sql = userRepository.createQueryBuilder('user').select().printSql()

  res.status(200).json({
    code: API_STATUS_CODE.SUCCESS,
    data: targetUser,
    message: 'success'
  })
}

export default withIronSessionApiRoute(getUserInfo, ironSessionOptions)