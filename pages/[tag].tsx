import React from 'react'
import styles from './index.module.scss'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { IArticle } from './api'
import MainList from 'components/MainList'
import { Empty } from 'antd'
import request from 'service/fetch'
import { API_STATUS_CODE } from 'types/enum'

const { useEffect, useState, useMemo } = React

const TagPage: NextPageWithPageConfig = () => {
  const router = useRouter()
  const { query } = router
  const tag = query?.tag as string
  const [articles, setArticles] = useState<IArticle[]>(Array.from({ length: 8 }))
  const isEmpty = useMemo(() => !articles?.length, [articles?.length])

  const getArticleList = async () => {
    const result = await request.get<IArticle[]>('/api/article/get', {
      params: {
        tag
      }
    })
    if (result.code === API_STATUS_CODE.SUCCESS) {
      setArticles(result.data)
    }
  }

  useEffect(() => {
    getArticleList()
  }, [query?.tag])

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