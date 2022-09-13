import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import styles from './index.module.scss'
import { Checkbox, Row, Col, Input, Button, message } from 'antd'
import request from 'service/fetch'
import { API_STATUS_CODE } from 'pages/enum'
import { useStore } from 'store'
import { useRouter } from 'next/router'
import { NextRequest, NextResponse } from 'next/server'
import getConnection from 'db'
import { Articles } from 'db/entity'
import { IArticle } from 'pages/api'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface ApiPostParamsType {
  title: string
  content: string
}

export const getServerSideProps = async (req: NextRequest & {
  params: {
    [index: string]: string
  }
}, res: NextResponse) => {
  const { id } = req.params

  if (!id || id === 'new') {
    return {
      props: {
  
      }
    } 
  }

  const connection = await getConnection()
  const articleDetail = await connection.getRepository(Articles).findOne({
    where: {
      id: Number(id),
    }
  })

  if (!articleDetail) {
    return {
      props: {
  
      }
    } 
  }

  return {
    props: {
      articleDetail: JSON.parse(JSON.stringify(articleDetail))
    }
  }
}

const EditorNew: NextPageWithPageConfig<{
  articleDetail: IArticle
}> = ({
  articleDetail
}) => {
  const router = useRouter()
  const { query } = router

  const { user: { userInfo: { id } } } = useStore()
  const [articleTitle, setArticleTitle] = useState(articleDetail?.title || '')
  const [articleContent, setArticleContent] = useState<string | undefined>(articleDetail?.content || '')
  const [isSyncScroll, setSyncScroll] = useState(true)
  const isNewArticle = query?.id === 'new'

  const handlePublic = async () => {
    const title = articleTitle?.trim()
    const content = articleContent?.trim()
    if(!title || !content) {
      message.error('标题或者文章内容不能为空')
      return
    }

    const params = {
      title,
      content,
    }
  
    const result = await (isNewArticle ? handlePublicArticle(params) : handleEditArticle(params))


    if (result.code !== API_STATUS_CODE.SUCCESS) {
      message.error(result.message)
      return
    }

    message.success(isNewArticle ? '发布成功!' : '修改成功')
    router.push(`/article/${result.data}`)
  }

  const handlePublicArticle = async (params: ApiPostParamsType) => {
    return await request.post('/api/article/public', params)
  }

  const handleEditArticle = async (params: ApiPostParamsType) => {
    return await request.post('/api/article/update', {
      ...params,
      id: query.id,
    })
  }

  return (
    <section className={styles.editorPage}>
      <Row align='middle' justify='space-between' className={styles.operation}>
        <Col span={22}>
          <Input placeholder='输入文章标题...' value={articleTitle} onChange={e => setArticleTitle(e.target.value || '')}></Input>
        </Col>
        <Col>
          <Button type="primary" onClick={handlePublic}>{isNewArticle ? '发布' : '编辑'}</Button>
        </Col>
      </Row>
      
      <MDEditor height={800} value={articleContent} enableScroll={isSyncScroll} onChange={string => setArticleContent(string)} />

      <Row justify='space-between' className={styles.footer}>
        <Col>
          字数: {articleContent?.length || 0}
        </Col>
        <Col>
          <Checkbox checked={isSyncScroll} onChange={e => setSyncScroll(e.target.checked)}>
            同步滚动
          </Checkbox>
        </Col>
      </Row>
    </section>
  )
}

EditorNew.layout = false

export default EditorNew
