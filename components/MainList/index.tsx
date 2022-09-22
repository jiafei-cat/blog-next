import styles from './index.module.scss'
import ListItem from 'components/ListItem'
import { NextPage } from 'next'
import { IArticle } from 'pages/api'
import { Skeleton } from 'antd'

const MainList: NextPage<{
  articles: IArticle[]
}> = ({
  articles,
}) => {
  return (
    <section className={styles.content}>
      {
        articles?.map((item, index) => (
          item ? <ListItem {...item} key={item.id} /> : <Skeleton active key={index} />
        ))
      }
    </section>
  )
}

export default MainList
