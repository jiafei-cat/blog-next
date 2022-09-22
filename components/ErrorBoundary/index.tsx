import React, { ReactElement } from 'react'
import styles from './index.module.scss'
import { BugOutlined } from '@ant-design/icons'
class ErrorBoundary extends React.Component<{
  children: React.ReactElement
}> {
  state = {
    hasError: false
  }
  static getDerivedStateFromError() {
    return {
      hasError: true,
    }
  }

  render() {
    const { hasError } = this.state
    if (hasError) {
      return (
        <section className={styles.errorPage}>
          <BugOutlined />
          <p>
            哦豁，页面出错了，请稍后再试
          </p>
        </section>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary