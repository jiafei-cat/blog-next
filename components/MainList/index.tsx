import styles from './index.module.scss'
import ListItem from 'components/ListItem'
import { NextPage } from 'next'
import { IArticle } from 'pages/api'

const MainList: NextPage<{
  articles: IArticle[]
}> = ({
  articles,
}) => {
  return (
    <section className={styles.content}>
      {
        articles?.map(item => (
          <ListItem {...item} key={item.id} />
        ))
      }
    </section>
  )
}

export default MainList
