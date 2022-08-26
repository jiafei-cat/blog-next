import React from 'react'
import type { NextPage } from 'next'

const Main: NextPage<{
  children: React.ReactElement,
}> = ({ children }) => {
  return <section>{children}</section>
}

export default Main
