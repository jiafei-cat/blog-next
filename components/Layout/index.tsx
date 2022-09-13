import type { NextPage } from 'next'
import React from 'react'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'
import Main from 'components/Main'
import styles from './index.module.scss'

const Layout: NextPage<{
  children: React.ReactElement,
}> = ({ children }) => {
  return (
    <section className={styles.layout}>
      <Navbar />
      <Main>{children}</Main>
      <Footer />
    </section>
  )
}

export default Layout
