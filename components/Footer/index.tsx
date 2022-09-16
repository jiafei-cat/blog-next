import styles from './index.module.scss'
import type { NextPage } from 'next'

const Footer: NextPage = () => {
  return (
    <footer className={styles.footer}>
      <section className={styles.footerContent}>
        <ul>
          <li><a href="https://github.com/jiafei-cat">About me</a></li>
          <li>|</li>
          <li><a href="https://github.com/jiafei-cat/blog-next">Project code</a></li>
        </ul>
      </section>
    </footer>
  )
}

export default Footer
