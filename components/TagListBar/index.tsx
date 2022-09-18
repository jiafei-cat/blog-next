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

  const handleGetTagList = async () => {
    const result = await request.get('/api/tag/get')
    setTagList(result?.data)
  }

  useEffect(() => {
    handleGetTagList()
  }, [])

  return (
    <section className={styles.tagListBarContainer}>
      <ul>
        <li onClick={() => router.push('/')}>全部</li>
        {
          tagList.map(item => (
            <li key={item.id} onClick={() => router.push(`/${item.title}`)}>{item.title}</li>
          ))
        }
        <li onClick={() => router.push('/tag')}>标签管理</li>
      </ul>
    </section>
  )
}

export default TagListBar