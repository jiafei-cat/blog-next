import React from 'react'
import styles from './index.module.scss'
import type { NextPage } from 'next'
import { Modal, Form, Button, Input, Row, Col, message } from 'antd'
import CountDown from 'components/CountDown'
import request from 'service/fetch'
import { observer } from 'mobx-react-lite'
import { API_STATUS_CODE } from 'types/enum'
import userStore, { IUserInfo } from 'store/userStore'
import { useStore } from 'store'

const { Item } = Form
const { useState } = React

const LoginModal: NextPage<{
  isShow: boolean
  onClose?: VoidFunction
}> = ({ isShow, onClose }) => {
  const [form] = Form.useForm()
  const DEFAULT_TIME_DOWN = 30
  const store = useStore()

  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false)

  const handleLogin = async (values: any) => {
    const result = await request.post('/api/user/login', values)
    if (result?.code !== API_STATUS_CODE.SUCCESS) {
      message.error(result?.message)
      return
    }

    store.user.setUserInfo(result.data as IUserInfo)
    onClose && onClose()
    message.success('登录成功!')
    window.location.reload()
  }

  const handleGetVerifyCode = async () => {
    const phone = await form.getFieldValue('phone')
    if (!phone) {
      message.error('请输入手机号后再获取!')
      return
    }

    const result = await request.post('/api/user/sendVerifyCode', {
      to: phone
    })

    if (result?.code !== API_STATUS_CODE.SUCCESS) {
      message.error(result?.message)
      return
    }

    setIsShowVerifyCode(true)
  }

  return (
    <Modal
      className={styles.loginModal}
      visible={isShow}
      footer={null}
      onCancel={onClose && onClose}
      width={400}
      maskClosable={false}
    >
        <section className="login-modal-content">
          <h2>手机号登录</h2>
          <Form layout="vertical" onFinish={handleLogin} form={form}>
            <Item
              name="phone"
              label="手机号"
              rules={[{ required: true, message: "请输入手机号" }]}
            >
              <Input type="text" placeholder="请输入手机号" />
            </Item>
            <Row  className={styles.verifyCodeBox}>
              <Col span={24}>
                <Item
                  name="verifyCode"
                  label="手机验证码"
                  rules={[{ required: true, message: "请输入验证码" }]}
                >
                  <Input width={'100%'} type="text" placeholder="请输入验证码" />
                </Item>
                <div className={styles.getVerifyCodeContainer}>
                  { isShowVerifyCode ? <CountDown time={DEFAULT_TIME_DOWN} onCountDown={() => setIsShowVerifyCode(false)} /> : (
                    <a href="#!" onClick={handleGetVerifyCode}>获取验证码</a>
                  )}
                </div>
              </Col>
            </Row>
            <Col span="24">
              <Button type="primary" htmlType="submit" style={{
                width: '100%',
                height: 40
              }}>登录</Button>
            </Col>
          </Form>
          <footer className={styles.loginModalFooter}>
            <p>
              <a href="#!">使用Github登录</a>
            </p>
            <p>
              注册登录即表示同意
              <a href="#!">隐私政策</a>
            </p>
          </footer>
        </section>
    </Modal>
  )
}

export default LoginModal
