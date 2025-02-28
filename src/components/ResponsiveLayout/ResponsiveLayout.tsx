'use client'

import { useEffect, useState } from 'react'
import styles from './ResponsiveLayout.module.css'
import { useRouter } from 'next/navigation'
import DropDown from '../DropDown/DropDown'

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
