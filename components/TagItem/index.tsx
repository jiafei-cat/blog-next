import styles from './index.module.scss'
import { createFromIconfontCN } from '@ant-design/icons'
import { NextPage } from 'next'
import { Button, message, Modal } from 'antd'
import request from 'service/fetch'
import { API_STATUS_CODE } from 'types/enum'
import { CountUp } from 'use-count-up'
import { ITag } from 'pages/api'
const { confirm } = Modal

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/c/font_3650928_yq7ly9vhfnj.js',
  ],
})

const TagItem: NextPage<ITag & {
  onChange: VoidFunction
}> = function ({
  id,
  title,
  icon,
  follow_count,
  article_count,
  isFollow,
  onChange,
}) {

  const handleConfirmFollow = async (isFollow: number) => {
    if (isFollow === 1) {
      confirm({
        title: '取消关注确认',
        content: '确认要取消关注吗?',
        onOk() {
          handleFollow('unFollow')
        },
        okText: '确定',
        cancelText: '取消',
      })
      return
    } else {
      handleFollow()
    }
  }

  const handleFollow = async (type = 'follow') => {
    const result = await request.post('/api/tag/follow', {
      id,
      type,
    })

    if (result.code !== API_STATUS_CODE.SUCCESS) {
      message.error(result.message)
      return
    }
    message.success(type === 'follow' ? '关注成功' : '取注成功')
    onChange && onChange()
  }

  return (
    <section className={styles.tagItemContainer}>
      <IconFont type={icon} />
      <span className={styles.title}>{title}</span>
      <span className={styles.count}>
        <em>
          已有 
          <i><CountUp isCounting end={follow_count} duration={3.2} /></i>
          人关注
        </em>
        <em>
          总计 
          <i><CountUp isCounting end={article_count} duration={3.2} /></i>
          篇文章
        </em>
      </span>
      <Button type='ghost' onClick={() => handleConfirmFollow(isFollow)}>{isFollow ? '取消关注' : '关注'}</Button>
    </section>
  )
}

export default TagItem