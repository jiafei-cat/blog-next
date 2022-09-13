import '../styles/globals.scss'
import React from 'react'
import type { AppProps } from 'next/app'
import Layout from 'components/Layout'
import { StoreProvider } from 'store'
import { IUserInfo } from 'store/userStore'
import { NextComponentType, NextPageContext } from 'next'
interface IProps extends AppProps {
  Component:  NextComponentType<NextPageContext, any, {}> & NextPageWithPageConfig
  initialValue: IUserInfo
}

function MyApp({ initialValue, Component, pageProps }: IProps) {
  let Container = null

  if (Component?.layout === false) {
    Container = (<Component {...pageProps} />)
  } else {
    Container = (
      <Layout {...Component?.layout}>
        <Component {...pageProps} />
      </Layout>
    )
  }


  return (
    <StoreProvider initialValue={initialValue} >
      {Container}
    </StoreProvider>
  )
}

MyApp.getInitialProps = ({ ctx }:{
  ctx: any
}) => {
  const { userId, nickname, avatar } = ctx?.req?.cookies || {}

  return {
    initialValue: {
      user: {
        userInfo: {
          id: Number(userId),
          nickname,
          avatar,
        }
      }
    }
  }
}

export default MyApp
