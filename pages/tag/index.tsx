import React from 'react'
import Head from 'next/head'
import type { NextPage } from 'next'
import styles from './index.module.scss'
import { message, Tabs } from 'antd'
import request from 'service/fetch'
import { API_STATUS_CODE } from 'types/enum'
import TagItem from 'components/TagItem'
import { ITag } from 'pages/api'
import { useStore } from 'store'
import { observer } from 'mobx-react-lite'

const { useState, useEffect } = React
const Tag: NextPage = () => {
  const store = useStore()
  const userInfo = store.user.userInfo
  const [tagsList, setTagsList] = useState<ITag[]>([])
  
  const getTagsList = async () => {
    const result = await request.get<ITag[]>('/api/tag/get')
    if (result.code !== API_STATUS_CODE.SUCCESS) {
      message.error(result.message)
      return
    }
    console.log(result)
    setTagsList(result.data || [])
  }

  useEffect(() => {
    getTagsList()
  }, [])

  return (
    <section className={styles.tagsContainer}>
      <Head>
        <title>标签页</title>
      </Head>
      <section>
        <Tabs type="card" centered defaultActiveKey="1">
          <Tabs.TabPane tab="全部标签" key="1">
            {
              tagsList.map(item => (
                <TagItem {...item} key={String(item.id)} onChange={getTagsList}></TagItem>
              ))
            }
          </Tabs.TabPane>
          {
            userInfo.id && (
              <Tabs.TabPane tab="已关注标签" key="2">
                {
                  tagsList.filter(i => i.isFollow === 1).map(item => (
                    <TagItem {...item} key={String(item.id)} onChange={getTagsList}></TagItem>
                  ))
                }
              </Tabs.TabPane>
            )
          }
        </Tabs>
      </section>
    </section>
  )
}

export default observer(Tag)
