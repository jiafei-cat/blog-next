import styles from './index.module.scss'
import type { NextPage } from 'next'
import React from 'react'

const { useRef, useEffect, useState } = React
const CountDown: NextPage<{
  time: number,
  onCountDown?: VoidFunction,
}> = ({ time, onCountDown }) => {
  const [countDownTime, setCountDownTime] = useState(time - 1 || 0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountDownTime((state) => {
        if (state <= 1) {
          timer && clearInterval(timer)
          onCountDown && onCountDown()
          return state
        }
        return state - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [time, onCountDown])

  return (
    <section
      className={styles.countDownContainer}
    >{`${countDownTime}s`}</section>
  )
}

export default CountDown
