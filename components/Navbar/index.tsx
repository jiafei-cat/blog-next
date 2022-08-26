import React from 'react'
import type { NextPage } from 'next'
import { navs } from 'components/Navbar/config'
import styles from './index.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from 'antd'
import LoginModal from 'components/LoginModal'

const { useState } = React

const Navbar: NextPage = () => {
  const { pathname, push } = useRouter()
  const [isShowLogin, setIsShowLogin] = useState(false)

  const handleGotoEditorPage = () => {}

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
        <section className={styles.operationArea}>
          <Button onClick={handleGotoEditorPage}>写文章</Button>
          <Button type="primary" onClick={handleLogin}>
            登录
          </Button>
        </section>
      </section>
      <LoginModal
        isShow={isShowLogin}
        onClose={() => setIsShowLogin(false)}
      ></LoginModal>
    </section>
  )
}

export default Navbar
