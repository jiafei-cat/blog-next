import React from 'react'
import { Row, Col, Menu, Avatar, MenuProps } from 'antd'
import styles from './index.module.scss'
import { useStore } from 'store'
import { observer } from 'mobx-react-lite'
import { AppstoreOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons'

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
];

const ChildrenMenu = () => {
  const store = useStore()
  const userInfo = store.user.userInfo
  console.log(userInfo)
  const handleClickMenu = ({
    key
  }: {
    key: string
  }) => {
    if(key === 'logout') {
      console.log('logout')
      store.user.setUserInfo({})
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