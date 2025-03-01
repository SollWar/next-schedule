'use client'

import styles from './ResponsiveLayout.module.css'

interface ResponsiveLayoutProps {
  children: React.ReactNode
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.content}> {children} </div>
      </div>
    </div>
  )
}
