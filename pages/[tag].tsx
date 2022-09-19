import styles from './index.module.scss'
import getConnection from 'db'
import { Articles } from 'db/entity'
import { NextApiRequest, NextApiResponse } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { IArticle } from './api'
import MainList from 'components/MainList'
import { Empty } from 'antd'

export async function getServerSideProps(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req
  const tag = query.tag as string | undefined

  const connection = await getConnection()
  const articleRepository = connection.getRepository(Articles)
  
  const targetArticles = await articleRepository.find({
    relations: ['tags', 'user'],
    where: {
      tags: {
        key: tag
      }
    }
  })

  if (!targetArticles?.length) {
    return {
      props: {}
    }
  }

  return {
    props: {
      articles: JSON.parse(JSON.stringify(targetArticles)),
    }
  }
}

const TagPage: NextPageWithPageConfig<{
  articles: IArticle[]
}> = ({
  articles,
}) => {
  const router = useRouter()
  const { query } = router
  const isEmpty = !articles?.length
  console.log(articles)
  return (
    <section>
      <Head>
        <title>{query?.tag}</title>
      </Head>
      {!isEmpty && <MainList articles={articles} />}
      {isEmpty && <Empty className={styles.empty} description="该标签下暂时没有文章哦"></Empty>}
    </section>
  )
}

TagPage.layout = {
  tagListBar: true
}

export default TagPage