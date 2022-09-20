import { ironSessionOptions } from 'config'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { API_STATUS_CODE } from 'types/enum'
import { clearCookie } from 'utils'
import { ISession } from '..'
import { Cookie } from 'next-cookie'

async function logout(req: NextApiRequest, res: NextApiResponse) {
  const session:ISession = req.session
  const cookie = Cookie.fromApiRoute(req, res)
  await session.destroy()
  clearCookie(cookie)

  res.status(200).json({
    code: API_STATUS_CODE.SUCCESS,
    data: null,
    message: 'success'
  })
}

export default withIronSessionApiRoute(logout, ironSessionOptions)
