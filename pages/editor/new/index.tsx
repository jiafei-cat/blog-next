import { NextPage } from 'next'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import styles from './index.module.scss'
import { Checkbox, Row, Col, Input, Button, message } from 'antd'
import request from 'service/fetch'
import { API_STATUS_CODE } from 'pages/enum'
import { useStore } from 'store'
import { useRouter } from 'next/router'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

const EditorNew: NextPageWithPageConfig = () => {
  const router = useRouter()
  const { user: { userInfo: { id } } } = useStore()
  const [articleTitle, setArticleTitle] = useState('')
  const [articleContent, setArticleContent] = useState<string | undefined>('**Hello world!!!**')
  const [isSyncScroll, setSyncScroll] = useState(true)

  const handlePublic = async () => {
    if(!articleTitle || !articleContent) {
      message.error('标题或者文章内容不能为空')
      return
    }

    const result = await request.post('/api/article/public', {
      title: articleTitle,
      content: articleContent,
    })

    if (result.code !== API_STATUS_CODE.SUCCESS) {
      message.error(result.message)
      return
    }

    message.success('发布成功!')
    router.push(`/user/${id}`)
  }

  return (
    <section className={styles.editorPage}>
      <Row align='middle' justify='space-between' className={styles.operation}>
        <Col span={22}>
          <Input placeholder='输入文章标题...' onChange={e => setArticleTitle(e.target.value?.trim() || '')}></Input>
        </Col>
        <Col>
          <Button type="primary" onClick={handlePublic}>发布</Button>
        </Col>
      </Row>
      
      <MDEditor height={800} value={articleContent || ''} enableScroll={isSyncScroll} onChange={string => setArticleContent(string?.trim())} />

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
