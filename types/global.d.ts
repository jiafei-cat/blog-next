import type { NextPage } from 'next'

interface PageConfig {
  /** 是否需要layout布局 */
  layout?: boolean | {
    /** 是否现实布局中的navbar */
    header?: boolean
    /** 是否现实布局中的footer */
    footer?: boolean
  }
}

declare global {
  type NextPageWithPageConfig<P = {}, IP = P> = NextPage<P, IP> & PageConfig
}

export {}