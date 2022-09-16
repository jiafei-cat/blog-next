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

const defaultLayoutConfig: PageConfig = {
  layout: {
    header: true,
    footer: true,
    tagListBar: false,
  }
}

const Layout: NextPage<{
  children: React.ReactElement,
  config: PageConfig
}> = ({
  children,
  config,
}) => {
  console.log(config)
  config = defaults(config, defaultLayoutConfig)
  console.log(config)

  const { layout } = config
  const isNotNeedLayout = Object.keys(layout).every((key) => !layout[key as keyof PageConfig['layout']])
  if (isNotNeedLayout) {
    return children
  }

  return (
    <section className={styles.layout}>
      <Affix>
        <Navbar />
        {layout.tagListBar && <TagListBar />}
      </Affix>
      <Main>{children}</Main>
      <Footer />
    </section>
  )
}

export default Layout
