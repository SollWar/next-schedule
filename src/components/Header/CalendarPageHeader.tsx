import { usePathname, useRouter } from 'next/navigation'
import styles from './Header.module.css'
import { useEffect, useState } from 'react'
import DropDown from '../DropDown/DropDown'

const CalendarPageHeader = () => {
  const [year] = useState(2025)
  const [month] = useState('Февраль')
  const router = useRouter()

  const onNewQueryClicl = (query: string) => {
    router.replace(query)
  }

  const onSelectedDwropDown = async (
    selected: string,
    selecteIndex: number
  ) => {
    switch (selecteIndex) {
      case 0: {
        if (selected == 'Никита') {
          onNewQueryClicl(
            `/calendar?type=user&id=6376611308&year=${year}&month=${month}`
          )
        } else if (selected === 'М7') {
          onNewQueryClicl(`/calendar?type=job&id=1&year=${year}&month=${month}`)
        }
      }
    }
  }

  return (
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
          Никита
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
  )
}

export default CalendarPageHeader
