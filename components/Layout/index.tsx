import type { NextPage } from 'next'
import React from 'react'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'
import Main from 'components/Main'
import styles from './index.module.scss'
import { PageConfig } from 'types/global'
import { Affix, BackTop } from 'antd'
import TagListBar from 'components/TagListBar'
import defaults from 'defaults'
import dynamic from 'next/dynamic'
import ErrorBoundary from 'components/ErrorBoundary'

const ProgressBar = dynamic(() => import('components/ProgressBar'), { ssr: false })

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
  config = defaults(config, defaultLayoutConfig)

  const { layout } = config
  const isNotNeedLayout = Object.keys(layout).every((key) => !layout[key as keyof PageConfig['layout']])
  if (isNotNeedLayout) {
    return children
  }

  return (
    <ErrorBoundary>
      <section className={styles.layout}>
          <ProgressBar />
          <Affix>
            <div>
              <Navbar />
              {layout.tagListBar && <TagListBar />}
            </div>
          </Affix>
          <Main>{children}</Main>
          <Footer />
          {layout.backTop && <BackTop />}
      </section>
    </ErrorBoundary>
  )
}

export default Layout
