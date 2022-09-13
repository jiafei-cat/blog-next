import { NextPage } from 'next'
import { IArticle } from 'pages/api'
import styles from './index.module.scss'
import { EyeOutlined } from '@ant-design/icons'
import zhLocale from 'date-fns/locale/zh-CN'
import { formatDistanceToNow } from 'date-fns'
import { markdownToTxt } from 'markdown-to-txt'
import Link from 'next/link'
const ListItem: NextPage<IArticle> = (item) => {
  return (
    <Link href={`/article/${item.id}`}>
      <section className={styles.listItem}>
          <div className={styles.userInfo}>
            <span>{item.user?.nickname}</span>
            <span>|</span>
            <span>{formatDistanceToNow(new Date(item.update_time), {
              locale: zhLocale
            })}</span>
          </div>
          <div className={styles.articleContent}>
            <h3>{item.title}</h3>
            <p>{markdownToTxt(item.content)}</p>
          </div>
          <div className={styles.articleInfo}>
            <p className={styles.views}>
              <EyeOutlined />
              <span>
                {item.views}
              </span>
            </p>
          </div>
      </section>
    </Link>
  )
}

export default ListItem
