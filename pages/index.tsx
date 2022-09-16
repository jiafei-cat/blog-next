import React from 'react'
import getConnection from 'db'
import { Articles } from 'db/entity'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import ListItem from 'components/ListItem'
import { IArticle } from './api'
import styles from './index.module.scss'

export async function getServerSideProps () {
  const connection = await getConnection()
  const articles = await connection.getRepository(Articles).find({
    relations: ['user', 'tags']
  })
  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)),
    }
  }
}

const Home: NextPageWithPageConfig<{
  articles: IArticle[]
}> = ({
  articles,
}) => {
  return (
    <div>
      <Head>
        <title>首页</title>
        <meta name="description" content="Blog - nextJs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className={styles.content}>
        {
          articles?.map(item => (
            <ListItem {...item} key={item.id} />
          ))
        }
      </section>
    </div>
  )
}

Home.layout = {
  tagListBar: true
}

export default Home
