import styles from './index.module.scss'
import React from 'react'
import type { NextPage } from 'next'

const Main: NextPage<{
  children: React.ReactElement,
}> = ({ children }) => {
  return <section className={styles.mainContent}>{children}</section>
}

export default Main
