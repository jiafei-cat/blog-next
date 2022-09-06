import type { NextApiRequest, NextApiResponse } from 'next'
import { format } from 'date-fns'
import md5 from 'md5'
import { encode } from 'js-base64'
import request from 'service/fetch'
import websiteConfig from 'website.config.json'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config'

type Data = {
  code: number
  data: null
  message: string
}

async function sendVerifyCode (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { to } = req.body
  const { accountSid, TOKEN, appId } = websiteConfig
  const timeStamp = format(new Date(), 'yyyyMMddHHmmss')
  const SigParameter = md5(`${accountSid}${TOKEN}${timeStamp}`)
  const Authorization = encode(`${accountSid}:${timeStamp}`)
  const verifyCode = Math.ceil((Math.random() * 8999)) + 1000
  const expireMinute = 5

  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${accountSid}/SMS/TemplateSMS?sig=${SigParameter}`

  const result = await request.post(url, {
    to,
    templateId: 1,
    appId,
    datas: [verifyCode, expireMinute]
  }, {
    headers: {
      Authorization
    }
  })
  const { statusCode, templateSMS, statusMsg } = result as any

  res = res.status(200)
  if(statusCode === '000000') {
    res.json({
      code: 0,
      data: templateSMS,
      message: '发送成功'
    })
  } else {
    res.json({
      code: statusCode,
      data: null,
      message: statusMsg
    })
  }
}

export default withIronSessionApiRoute(sendVerifyCode, ironOptions)