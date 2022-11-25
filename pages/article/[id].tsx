import React from 'react'
import { Avatar, Input, Button, message } from 'antd'
import getConnection from 'db'
import { Articles } from 'db/entity'
import { GetServerSideProps, NextPage } from 'next'
import { IArticle } from 'pages/api'
import styles from './index.module.scss'
import MarkDown from 'react-markdown'
import Head from 'next/head'
import { format, formatDistanceToNow } from 'date-fns'
import zhLocale from 'date-fns/locale/zh-CN'
import Link from 'next/link'
import { useStore } from 'store'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import platform from 'platform'
import { useRouter } from 'next/router'
import request from 'service/fetch'
import { API_STATUS_CODE } from 'types/enum'

const { TextArea } = Input
const { useState } = React

export const getServerSideProps:GetServerSideProps = async function ({ req, res, params }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  const articleId = params?.id
  if (!articleId) {
    return {
      props: {}
    }
  }

  const connection = await getConnection()
  const articleRepository = connection.getRepository(Articles)

  const articleDetail = await articleRepository.findOne({
    where: {
      id: Number(articleId)
    },
    order: {
      comments: {
        create_time: 'DESC',
      }
    },
    relations: ['user', 'comments', 'comments.user']
  })
  
  if (!articleDetail) {
    return {
      props: {}
    }
  }

  if(!!articleDetail?.views || articleDetail?.views === 0) {
    articleDetail.views += 1
  }

  articleRepository.save(articleDetail)
  return {
    props: {
      articleDetail: JSON.parse(JSON.stringify(articleDetail))
    }
  }
}

/**
 * markdown code highlighter style selector:
 * https://react-syntax-highlighter.github.io/react-syntax-highlighter/demo/
 */
const ArticleDetail: NextPage<{
  articleDetail: IArticle
}> = ({
  articleDetail
}) => {
  const [commentList, setCommentList] = useState(articleDetail?.comments)
  const router = useRouter()
  const store = useStore()
  const userInfo = store.user.userInfo
  const userId = userInfo?.id
  const [comment, setComment] = useState('')
  const articleId = router.query?.id

  const handleComment = async () => {
    if (!articleId) {
      return
    }

    const result = await request.post('/api/comment/public', {
      content: comment?.trim(),
      id: articleId,
    })

    if (result.code !== API_STATUS_CODE.SUCCESS) {
      message.error(result.message)
      return
    }

    message.success('发表成功!')
    setComment('')
    setCommentList(state => [result.data].concat(state))
  }

  return (
    <section className={styles.articleContainer}>
      <Head>
        <title>{articleDetail.title}</title>
      </Head>
      <div className={styles.articleContent}>
        <h2>{articleDetail.title}</h2>
        <div className={styles.userInfo}>
          <Avatar className={styles.avatar} src={articleDetail.user.avatar}></Avatar>
          <p>
            <em onClick={() => router.push(`/user/${articleDetail.user.id}`)}>{articleDetail.user.nickname}</em>
            <em>
              {format(new Date(articleDetail.update_time), 'yyyy年MM月dd日 HH:mm:ss')} 
              &nbsp; 阅读 {articleDetail.views}
              {
                userId === articleDetail.user.id && (<Link href={`/editor/${articleDetail.id}`}>编辑</Link>)
              }
            </em>
          </p>
        </div>

        <div className={styles.content}>
          <MarkDown components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                PreTag="div"
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }}}>{articleDetail.content}</MarkDown>
        </div>
      </div>
      <div className={styles.commentList}>
        <div className={styles.commentOperation}>
          <h4>评论</h4>
          <div className={styles.operation}>
            <Avatar className={styles.avatar} src={userInfo?.avatar}></Avatar>
            <TextArea
              value={comment}
              onChange={e => setComment(e.target.value)}
              onKeyDown={e => {
                if(e.metaKey && e.keyCode === 13) {
                  handleComment()
                }
              }}
              className={styles.textArea}
              placeholder={(platform.os?.family?.indexOf('OS') || - 1) < 0 ? '输入评论（Enter换行，⌘ + Enter发送）' : '输入评论（Enter换行，Ctrl + Enter发送）'}
              autoSize={{ minRows: 4, maxRows: 6 }}
            />
          </div>
          <div className={styles.footer}>
            <Button type='primary' onClick={handleComment}>发表评论</Button>
          </div>
        </div>
        {
          !!commentList?.length && (
            <div className={styles.commentContent}>
              <h4>热门评论</h4>
              <ul>
                {
                  commentList?.map(item => (
                    <li key={item.id}>
                      <p className={styles.userInfo}>
                        <Avatar src={item.user.avatar} />
                        <span onClick={() => router.push(`/user/${item.user.id}`)}>{item.user.nickname}</span>
                        <span>{formatDistanceToNow(new Date(item.create_time), {
                          locale: zhLocale
                        })}前</span>
                      </p>
                      <p className={styles.content}>
                        {item.content}
                      </p>
                    </li>
                  ))
                }
              </ul>
            </div>
          )
        }
      </div>
    </section>
  )
}

export default ArticleDetail