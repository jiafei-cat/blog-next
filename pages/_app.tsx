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
  return (
    <StoreProvider initialValue={initialValue} >
      <Layout config={{
        layout: Component?.layout
      }}>
        <Component {...pageProps} />
      </Layout>
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
