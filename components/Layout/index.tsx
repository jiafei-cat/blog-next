import type { NextPage } from 'next'
import React from 'react'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'
import Main from 'components/Main'
import styles from './index.module.scss'
import { PageConfig } from 'types/global'
import { Affix } from 'antd'
import TagListBar from 'components/TagListBar'
import defaults from 'defaults'
import { useRouter } from 'next/router'
import RotateLoader from 'react-spinners/RotateLoader'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

const defaultLayoutConfig: PageConfig = {
  layout: {
    header: true,
    footer: true,
    tagListBar: false,
  }
}

const { useEffect } = React
const Layout: NextPage<{
  children: React.ReactElement,
  config: PageConfig
}> = ({
  children,
  config,
}) => {
  const router = useRouter()
  const [pageLoading, setPageLoading] = React.useState<boolean>(false)

  useEffect(() => {
    const handleStart = () => { setPageLoading(true) }
    const handleComplete = () => { setPageLoading(false) }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)
  }, [router])

  useEffect(() => {
    pageLoading ? disableBodyScroll(document.body) : enableBodyScroll(document.body)
  }, [pageLoading])

  config = defaults(config, defaultLayoutConfig)

  const { layout } = config
  const isNotNeedLayout = Object.keys(layout).every((key) => !layout[key as keyof PageConfig['layout']])
  if (isNotNeedLayout) {
    return children
  }

  return (
    <section className={styles.layout}>
      {pageLoading && (
        <div className={styles.loading}>
          <RotateLoader color="#1890ff" />
        </div>
      )}
      <Affix>
        <div>
          <Navbar />
          {layout.tagListBar && <TagListBar />}
        </div>
      </Affix>
      <Main>{children}</Main>
      <Footer />
    </section>
  )
}

export default Layout
