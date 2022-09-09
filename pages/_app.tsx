import '../styles/globals.scss'
import React from 'react'
import type { AppProps } from 'next/app'
import Layout from 'components/Layout'
import { StoreProvider } from 'store'
import { IUserInfo } from 'store/userStore'

interface IProps extends AppProps {
  initialValue: IUserInfo
}

function MyApp({ initialValue, Component, pageProps }: IProps) {
  console.log('initialValue')
  console.log(initialValue)
  return (
    <StoreProvider initialValue={initialValue} >
      <Layout>
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
          id: userId,
          nickname,
          avatar,
        }
      }
    }
  }
}

export default MyApp
