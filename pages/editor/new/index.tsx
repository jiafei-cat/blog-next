import { NextPage } from 'next'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

const EditorNew: NextPageWithPageConfig = () => {
  const [value, setValue] = useState<string | undefined>('**Hello world!!!**')
  return (
    <section className="next-page">
      新写文章
      <MDEditor value={value || ''} onChange={string => setValue(string)} />
    </section>
  )
}

EditorNew.layout = false

export default EditorNew
