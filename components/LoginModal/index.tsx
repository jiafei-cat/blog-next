import React from 'react'
import styles from './index.module.scss'
import type { NextPage } from 'next'
import { Modal, Form, Button, Input, Row, Col } from 'antd'
import CountDown from 'components/CountDown'

const { Item } = Form
const { useState } = React

const LoginModal: NextPage<{
  isShow: boolean
  onClose?: VoidFunction
}> = ({ isShow, onClose }) => {
  const DEFAULT_TIME_DOWN = 30

  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false)

  const handleLogin = (values: any) => {
    console.log(values)
  }

  const handleGetVerifyCode = () => {
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
          <Form layout="vertical" onFinish={handleLogin}>
            <Item
              name="phone"
              label="手机号"
              rules={[{ required: true, message: "请输入手机号" }]}
            >
              <Input type="text" placeholder="请输入手机号" />
            </Item>
            <Item
              name="verifyCode"
              label="手机验证码"
              rules={[{ required: true, message: "请输入验证码" }]}
            >
              <Input.Group compact className={styles.verifyCodeBox}>
                <Input type="text" placeholder="请输入验证码" />
                <div className={styles.getVerifyCodeContainer}>
                  { isShowVerifyCode ? <CountDown time={DEFAULT_TIME_DOWN} onCountDown={() => setIsShowVerifyCode(false)} /> : (
                    <a href="javascript:void(0);" onClick={handleGetVerifyCode}>获取验证码</a>
                  )}
                </div>
              </Input.Group>
            </Item>
            <Col span="24">
              <Button type="primary" htmlType="submit" style={{
                width: '100%',
                height: 40
              }}>登录</Button>
            </Col>
          </Form>
          <footer className={styles.loginModalFooter}>
            <p>
              <a href="">使用Github登录</a>
            </p>
            <p>
              注册登录即表示同意
              <a href="">隐私政策</a>
            </p>
          </footer>
        </section>
    </Modal>
  )
}

export default LoginModal
