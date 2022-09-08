import React from 'react'
import type { NextPage } from 'next'
import { navs } from 'components/Navbar/config'
import styles from './index.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Avatar, Button, Dropdown, Menu } from 'antd'
import LoginModal from 'components/LoginModal'
import { observer } from 'mobx-react-lite'
import { useStore } from 'store'
import ChildrenMenu from './ChildrenMenu'

const { useState, useEffect } = React

const Navbar: NextPage = () => {
  const { pathname, push } = useRouter()
  const store = useStore()
  const { user: { userInfo }}  = store
  const isLogin = !!userInfo?.id

  const [isShowLogin, setIsShowLogin] = useState(false)

  const handleGotoEditorPage = () => {
  }

  const handleLogin = () => {
    setIsShowLogin(true)
  }

  return (
    <section className={styles.navbar}>
      <section className={styles.inner}>
        <section className={styles.logArea}>
          <Link href="/">Blog-log</Link>
        </section>
        <section className={styles.linkArea}>
          <ul>
            {navs?.map((nav) => (
              <li
                key={nav?.label}
                className={pathname === nav?.value ? styles.active : ''}
              >
                <Link href={nav?.value}>{nav?.label}</Link>
              </li>
            ))}
          </ul>
        </section>
        {
          isLogin && (
            <section className={styles.userInfo}>
              <Button onClick={handleGotoEditorPage}>写文章</Button>
              <Dropdown placement="bottom" arrow overlay={<ChildrenMenu />}>
                <Avatar src={userInfo?.avatar}></Avatar>
              </Dropdown>
            </section>
          )
        }
        {
          !isLogin && (
            <section className={styles.operationArea}>
              <Button type="primary" onClick={handleLogin}>
                登录
              </Button>
            </section>
          )
        }
      </section>
      <LoginModal
        isShow={isShowLogin}
        onClose={() => setIsShowLogin(false)}
      ></LoginModal>
    </section>
  )
}

export default observer(Navbar)
