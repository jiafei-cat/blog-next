import React from 'react'
import { Avatar, Button, Empty } from "antd"
import getConnection from "db"
import { Articles, User } from "db/entity"
import { NextApiRequest, NextApiResponse, NextPage } from "next"
import { useRouter } from "next/router"
import { IArticle } from 'pages/api'
import { IUserInfo } from "store/userStore"
import styles from './index.module.scss'
import { EyeOutlined, ProfileOutlined } from '@ant-design/icons'
import { CountUp } from 'use-count-up'
import ListItem from 'components/ListItem'
import { useStore } from 'store'
import Head from 'next/head'

export async function getServerSideProps(req: NextApiRequest, res: NextApiResponse) {
  const curUserId = req?.query?.id
  if (!curUserId) {
    return {
      props: {}
    }
  }

  const connection = await getConnection()
  const userRepository = await connection.getRepository(User)

  const curUserInfo = await userRepository.findOne({
    where: {
      id: Number(curUserId)
    },
    relations: []
  })

  if (!curUserInfo?.id) {
    return {
      props: {}
    }
  }

  const articleRepository = await connection.getRepository(Articles)
  const curUserArticle = await articleRepository.find({
    where: {
      user: {
        id: Number(curUserInfo.id)
      },
    },
    relations: ['user']
  })

  return {
    props: {
      userInfo: JSON.parse(JSON.stringify(curUserInfo)),
      article: JSON.parse(JSON.stringify(curUserArticle))
    }
  }
}

const { useMemo } = React
const UserIndex: NextPage<{
  userInfo: IUserInfo
  article: IArticle[]
}> = ({
  userInfo,
  article,
}) => {
  const store = useStore()
  const curUserInfo = store.user?.userInfo
  const router = useRouter()
  const readCount = useMemo(() => article?.reduce((pre, i) => pre + Number(i.views),0), [])

  if (!userInfo) {
    return (
      <section className={styles.personalPage}>
        <Head>
          <title>哦额，该用户不存在~</title>
        </Head>
        <Empty />
      </section>
    )
  }

  return (
    <section className={styles.personalPage}>
      <Head>
        <title>{userInfo.nickname}的个人主页</title>
      </Head>
      <section className={styles.userInfo}>
        <Avatar className={styles.avatar} src={userInfo.avatar} />
        <div className={styles.userInfoDetail}>
          <span>{userInfo.nickname}</span>
          <span>
            <ProfileOutlined />
            {userInfo.job}
          </span>
          <span>{userInfo.introduce}</span>
        </div>
        {
          curUserInfo?.id === userInfo?.id && <Button type='ghost' onClick={() => {
            router.push('/user/profile')
          }}>编辑个人资料</Button>
        }
      </section>
      <section className={styles.articleCount}>
        <h3>个人成就</h3>
        <ul>
          <li>
            <EyeOutlined />
            <em>
              文章被阅读 
            </em>
            <i>
              <CountUp isCounting end={readCount} duration={3.2} />
            </i>
          </li>
        </ul>
      </section>
      <section className={styles.articleList}>
        {
          article?.map(item => (
            <ListItem {...item} key={item.id} />
          ))
        }
      </section>
    </section>
  )
}

export default UserIndex