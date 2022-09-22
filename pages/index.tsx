import React from 'react'
import getConnection from 'db'
import { Articles } from 'db/entity'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import ListItem from 'components/ListItem'
import { IArticle } from './api'
import styles from './index.module.scss'
import MainList from 'components/MainList'
import request from 'service/fetch'
import { API_STATUS_CODE } from 'types/enum'

// export async function getServerSideProps () {
//   const connection = await getConnection()
//   const articles = await connection.getRepository(Articles).find({
//     relations: ['user', 'tags']
//   })
//   return {
//     props: {
//       articles: JSON.parse(JSON.stringify(articles)),
//     }
//   }
// }

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
