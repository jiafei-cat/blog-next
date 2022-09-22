import type { NextPage } from 'next'

export interface PageConfig {
  /** 是否需要layout布局 */
  layout: {
    /** 是否显示布局中的navbar */
    header?: boolean
    /** 是否显示布局中的footer */
    footer?: boolean
    /** 是否显示布局中的tagListBar */
    tagListBar?: boolean
    /** 是否显示返回顶部按钮 */
    backTop?: boolean
  }
}

declare global {
  type NextPageWithPageConfig<P = {}, IP = P> = NextPage<P, IP> & PageConfig
}

export {}