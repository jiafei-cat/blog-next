import styles from './index.module.scss'
import { Form, Input, Button } from 'antd'
import Head from 'next/head'

const Profile = () => {
  const [form] = Form.useForm()

  const handleSubmit = async () => {
    const value = await form.validateFields()
    console.log(value)
  }

  return (
    <section className={styles.profileContainer}>
      <Head>
        <title>编辑个人资料</title>
      </Head>
      <section className={styles.content}>
        <h3>编辑个人资料</h3>
        <Form layout='vertical' form={form} onFinish={handleSubmit}>
          <Form.Item name="nickname" label="昵称" rules={[{
            required: true,
            message: '请填写您的昵称'
          }]}>
            <Input placeholder='请填写您的昵称' />
          </Form.Item>
          <Form.Item name="job" label="职业" rules={[{
            required: true,
            message: '请填写您的职业'
          }]}>
            <Input placeholder='请填写您的职业' />
          </Form.Item>
          <Form.Item name="introduce" label="自我介绍" rules={[{
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
