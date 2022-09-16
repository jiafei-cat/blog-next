import { ITag } from 'pages/api'
import React from 'react'
import request from 'service/fetch'
import styles from './index.module.scss'
import Link from 'next/link'

const { useState, useEffect } = React
const TagListBar = () => {
  const [tagList, setTagList] = useState<ITag[]>([])

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
        <li>全部</li>
        {
          tagList.map(item => (
            <li key={item.id}>{item.title}</li>
          ))
        }
      </ul>
    </section>
  )
}

export default TagListBar