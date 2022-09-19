import { ITag } from 'pages/api'
import React from 'react'
import request from 'service/fetch'
import styles from './index.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'

const { useState, useEffect } = React
const TagListBar = () => {
  const [tagList, setTagList] = useState<ITag[]>([])
  const router = useRouter()
  const { tag } = router.query

  const handleGetTagList = async () => {
    const result = await request.get('/api/tag/get')
    setTagList([
      { title: '全部', id: 'all', key: '/' },
      ...(result?.data || []),
      { title: '标签管理', id: 'tag', key: 'tag' }
    ])
  }

  useEffect(() => {
    handleGetTagList()
  }, [])

  return (
    <section className={styles.tagListBarContainer}>
      <ul>
        {
          tagList.map(item => (
            <li
              key={item.id}
              className={item.key === tag ? 'active' : ''}
              onClick={() => router.push(`/${item.key || ''}`)}
            >{item.title}</li>
          ))
        }
      </ul>
    </section>
  )
}

export default TagListBar