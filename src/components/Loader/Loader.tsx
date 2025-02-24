// components/Loader.tsx
import React from 'react'

import styles from './Loader.module.css'

interface LoaderProps {
  isLoading: boolean
  children: React.ReactNode
  days: number
  fakeDays: number
}

const Loader = ({ isLoading, children, days, fakeDays }: LoaderProps) => {
  const loaders = new Array(days).fill(0)

  const fakeDaysL = new Array(fakeDays).fill(0)
  if (isLoading) {
    return (
      <div className={styles.main}>
        {fakeDaysL.map((_, index) => (
          <div key={`fake_loader_${index}`}></div>
        ))}
        {loaders.map((_, index) => (
          <div key={`loader_${index}`} className={styles.card}></div>
        ))}
      </div>
    )
  }

  return <>{children}</>
}

export default Loader
