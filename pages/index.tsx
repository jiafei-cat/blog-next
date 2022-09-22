import React from 'react'
import Head from 'next/head'
import { IArticle } from './api'
import MainList from 'components/MainList'
import request from 'service/fetch'
import { API_STATUS_CODE } from 'types/enum'

const { useEffect, useState } = React
const Home: NextPageWithPageConfig = () => {
  const [articles, setArticles] = useState<IArticle[]>(Array.from({ length: 8 }))

  const getArticleList = async () => {
    const result = await request.get<IArticle[]>('/api/article/get')
    if (result.code === API_STATUS_CODE.SUCCESS) {
      setArticles(result.data)
    }
  }

  useEffect(() => {
    getArticleList()
  }, [])

  return (
    <div>
      <Head>
        <title>首页</title>
        <meta name="description" content="Blog - nextJs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainList articles={articles} />
    </div>
  )
}

Home.layout = {
  tagListBar: true,
  backTop: true,
}

export default Home
