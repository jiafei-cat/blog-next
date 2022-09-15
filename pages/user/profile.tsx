import React from 'react'
import styles from './index.module.scss'
import { Form, Input, Button, message } from 'antd'
import Head from 'next/head'
import request from 'service/fetch'
import { IUserInfo } from 'store/userStore'
import { API_STATUS_CODE } from 'pages/enum'
import { useRouter } from 'next/router'
import { useStore } from 'store'

const { useEffect, useState } = React
const Profile = () => {
  const [form] = Form.useForm()
  const router = useRouter()
  const store = useStore()
  const [userInfo, setUserInfo] = useState<IUserInfo>()
  const handleSubmit = async () => {
    const value = await form.validateFields()

    const result = await request.post('/api/user/update', value)
    if (result.code === API_STATUS_CODE.NOT_LOGIN) {
      message.error('请先登录!')
      return
    }
  
    if (result.code !== API_STATUS_CODE.SUCCESS) {
      message.error('未知错误!')
      return
    }
    message.success('修改成功!')
    router.push(`/user/${result?.data?.id}`)
    store.user.setUserInfo(result.data)
  }

  const getUserInfo = async () => {
    const result = await request.get('/api/user/detail')
    if (result.code === API_STATUS_CODE.NOT_LOGIN) {
      message.error('请先登录!')
      return
    }
  
    if (result.code !== API_STATUS_CODE.SUCCESS) {
      message.error('获取个人信息失败!')
      return
    }
  
    setUserInfo(result.data)
    form.setFieldsValue(result.data)
  }

  useEffect(() => {
    getUserInfo()
  }, [])
  return (
    <section className={styles.profileContainer}>
      <Head>
        <title>编辑个人资料</title>
      </Head>
      <section className={styles.content}>
        <h3>编辑个人资料</h3>
        <Form layout='vertical' form={form} onFinish={handleSubmit}>
          <Form.Item name="nickname" initialValue={userInfo?.nickname} label="昵称" rules={[{
            required: true,
            message: '请填写您的昵称'
          }]}>
            <Input placeholder='请填写您的昵称' />
          </Form.Item>
          <Form.Item name="job" initialValue={userInfo?.job} label="职业" rules={[{
            required: true,
            message: '请填写您的职业'
          }]}>
            <Input placeholder='请填写您的职业' />
          </Form.Item>
          <Form.Item name="introduce" initialValue={userInfo?.introduce} label="自我介绍" rules={[{
            required: true,
            message: '请填写您的自我介绍'
          }]}>
            <Input placeholder='自我介绍有助于大家认识你' />
          </Form.Item>
          <Button type="primary" htmlType='submit'>提交修改</Button>
        </Form>
      </section>
    </section>
  )
}

export default Profile
