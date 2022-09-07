import styles from './index.module.scss'
import type { NextPage } from 'next'

const Footer: NextPage = () => {
  return (
    <footer className={styles.footer}>
      <section className={styles.footerContent}>页脚</section>
    </footer>
  )
}

export default Footer
