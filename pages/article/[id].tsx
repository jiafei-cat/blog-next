import { Avatar } from 'antd'
import getConnection from 'db'
import { Articles } from 'db/entity'
import { NextApiRequest, NextApiResponse, NextPage } from 'next'
import { IArticle } from 'pages/api'
import styles from './index.module.scss'
import MarkDown from 'react-markdown'
import Head from 'next/head'
import { format } from 'date-fns'
import Link from 'next/link'
import { useStore } from 'store'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'


export async function getServerSideProps(req: NextApiRequest & {
  params: {
    [index: string]: string
  }
}, res: NextApiResponse) {
  const articleId = req.params?.id

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
    relations: ['user']
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
  const store = useStore()
  const userId = store.user?.userInfo?.id
  console.log(articleDetail)
  console.log(userId)
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
            <em>{articleDetail.user.nickname}</em>
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
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }}}>{articleDetail.content}</MarkDown>
        </div>
      </div>
    </section>
  )
}

export default ArticleDetail