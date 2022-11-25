import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import React from 'react'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import styles from './index.module.scss'
import { Checkbox, Row, Col, Input, Button, message, Select } from 'antd'
import request from 'service/fetch'
import { API_STATUS_CODE } from 'types/enum'
import { useStore } from 'store'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import getConnection from 'db'
import { Articles } from 'db/entity'
import { IArticle, ITag } from 'pages/api'
import Head from 'next/head'
const { Option } = Select

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface ApiPostParamsType {
  title: string
  content: string
}

export const getServerSideProps:GetServerSideProps = async function ({ req, res, params }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  const { id } = params || {}

  if (!id || id === 'new') {
    return {
      props: {
  
      }
    } 
  }

  const connection = await getConnection()
  const articleDetail = await connection.getRepository(Articles).findOne({
    relations: ['tags'],
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

const { useEffect } = React
const EditorNew: NextPageWithPageConfig<{
  articleDetail: IArticle
}> = ({
  articleDetail
}) => {
  const router = useRouter()
  const { query } = router

  const { user: { userInfo: { id } } } = useStore()
  const [tagsList, setTagsList] = useState<ITag[]>([])
  const [selectTagsList, setSelectTagsList] = useState<string[]>(articleDetail?.tags?.map(i => String(i.id)))
  const [articleTitle, setArticleTitle] = useState(articleDetail?.title || '')
  const [articleContent, setArticleContent] = useState<string | undefined>(articleDetail?.content || '')
  const [isSyncScroll, setSyncScroll] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
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
      tagsList: selectTagsList,
    }

    setSubmitLoading(true)
    const result = await (isNewArticle ? handlePublicArticle(params) : handleEditArticle(params))
    setSubmitLoading(false)

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

  const handleGetTagList = async () => {
    const result = await request.get('/api/tag/get')

    setTagsList(result?.data || [])
  }

  const handleChange = (idList: string[]) => {
    if (idList.length > 3) {
      message.warning('最多3个标签')
      return
    }
    setSelectTagsList(idList)
  }

  useEffect(() => {
    handleGetTagList()
  }, [])

  return (
    <section className={styles.editorPage}>
      <Head>
        <title>{isNewArticle ? '发布' : '编辑'}文章</title>
      </Head>
      <Row align='middle' justify='space-between' className={styles.operation}>
        <Col span={14}>
          <Input placeholder='输入文章标题...' value={articleTitle} onChange={e => setArticleTitle(e.target.value || '')}></Input>
        </Col>
        <Col span={6}>
          <Select
            mode="multiple"
            placeholder="选择文章标签"
            onChange={handleChange}
            style={{ width: '100%' }}
            maxTagCount={3}
            value={selectTagsList}
          >
            {
              tagsList?.map(item => (
                <Option key={item.id}>
                  {item.title}
                </Option>
              ))
            }
          </Select>
        </Col>
        <Col>
          <Button type="primary" loading={submitLoading} onClick={handlePublic}>{isNewArticle ? '发布' : '编辑'}</Button>
        </Col>
      </Row>
      
      <MDEditor height={800} value={articleContent} enableScroll={isSyncScroll} onChange={string => setArticleContent(string)} />

      <Row justify='space-between' className={styles.footer}>
        <Col>
          字数: {articleContent?.replace(/ /g, '')?.length || 0}
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

EditorNew.layout = {
  header: false,
  footer: false,
}

export default EditorNew
