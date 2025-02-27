'use client'

import { useState } from 'react'
import styles from './ResponsiveLayout.module.css'
import { useRouter } from 'next/navigation'
import DropDown from '../DropDown/DropDown'

interface ResponsiveLayoutProps {
  onNewQueryClicl: (query: string) => void
  children: React.ReactNode
}

export default function ResponsiveLayout({
  onNewQueryClicl,
  children,
}: ResponsiveLayoutProps) {
  const [schedule, setSchedule] = useState('Никита')
  const [year] = useState(2025)
  const [month] = useState('Февраль')
  const router = useRouter()

  const onSelectedDwropDown = async (
    selected: string,
    selecteIndex: number
  ) => {
    switch (selecteIndex) {
      case 0: {
        setSchedule(selected)
        if (selected == 'Никита') {
          console.log(selected)
          onNewQueryClicl(
            `/calendar?type=user&id=6376611308&year=${year}&month=${month}`
          )
        } else if (selected === 'М7') {
          console.log(selected)
          onNewQueryClicl(`/calendar?type=job&id=1&year=${year}&month=${month}`)
        }
      }
    }
  }

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
            <button
              className={styles.menuButton}
              onClick={() => {
                router.push('/setting')
              }}
            >
              Настройки
            </button>
            <DropDown
              className={styles.menuButton}
              key={'id'}
              options={['Никита', 'М7']}
              onSelected={onSelectedDwropDown}
              index={0}
              style={{
                cursor: 'pointer',
              }}
            >
              {schedule}
            </DropDown>
          </div>
          <div
            style={{
              display: 'flex',
              height: '100%',
            }}
          >
            <DropDown
              className={styles.menuButton}
              key={'year'}
              options={['2025', '2026']}
              onSelected={function (selected: string, index: number): void {
                console.log(selected, index)
              }}
              index={1}
              style={{
                cursor: 'pointer',
              }}
            >
              {year}
            </DropDown>
            <DropDown
              className={styles.menuButton}
              key={'month'}
              options={['Февраль', 'Март']}
              onSelected={function (selected: string, index: number): void {
                console.log(selected, index)
              }}
              index={2}
              style={{
                cursor: 'pointer',
              }}
            >
              {month}
            </DropDown>
          </div>
        </header>
        <div className={styles.content}> {children} </div>
      </div>
    </div>
  )
}
