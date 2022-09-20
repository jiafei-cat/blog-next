import React from 'react'
import { Row, Col, Menu, Avatar, MenuProps, message } from 'antd'
import styles from './index.module.scss'
import { useStore } from 'store'
import { observer } from 'mobx-react-lite'
import { LoginOutlined, UserOutlined } from '@ant-design/icons'
import request from 'service/fetch'
import { API_STATUS_CODE } from 'types/enum'
import { useRouter } from 'next/router'

const items: MenuProps['items'] = [
  {
    key: 'user',
    label: '我的主页',
    icon: <UserOutlined style={{ fontSize: 16, color: '#666' }} />,
  },
  {
    key: 'logout',
    label: '退出登录',
    icon: <LoginOutlined style={{ fontSize: 16, color: '#666' }} />,
  }
]

const ChildrenMenu = () => {
  const store = useStore()
  const userInfo = store.user.userInfo
  const { push } = useRouter()
  const handleClickMenu = ({
    key
  }: {
    key: string
  }) => {
    if(key === 'logout') {
      console.log('logout')
      handleLogout()
    }
    if (key === 'user') {
      push(`/user/${store.user.userInfo.id}`)
    }
  }

  const handleLogout = async () => {
    const result = await request.post('/api/user/logout')

    if (result.code !== API_STATUS_CODE.SUCCESS) {
      message.error(result.message)
    } else {
      store.user.setUserInfo({})
      message.success('退出成功!')
      window.location.reload()
    }
  }

  return (
    <section className={styles.childrenMenu}>
      <Row align='middle'>
        <Col>
          <Avatar src={userInfo?.avatar} />
        </Col>
        <Col>
          <p className={styles.userName}>{userInfo?.nickname}</p>
        </Col>
      </Row>
      <Menu className={styles.userMenu} onClick={handleClickMenu} items={items} />
    </section>
  )
}

export default observer(ChildrenMenu)