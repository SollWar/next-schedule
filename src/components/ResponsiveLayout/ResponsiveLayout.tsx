'use client'

import { useState } from 'react'
import styles from './ResponsiveLayout.module.css'

export default function ResponsiveLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loding] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div
            style={{
              display: 'flex',
              height: '100%',
            }}
          >
            <button className={styles.menuButton}>Меню</button>
            <button className={styles.menuButton}>Климовск</button>
          </div>
          <div
            style={{
              display: 'flex',
              height: '100%',
            }}
          >
            <button className={styles.menuButton}>2025</button>
            <button className={styles.menuButton}>Февраль</button>
          </div>
        </header>
        <div className={styles.content}> {loding ? 'Loading' : children} </div>
      </div>
    </div>
  )
}
