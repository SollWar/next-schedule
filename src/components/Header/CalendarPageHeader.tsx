import { usePathname, useRouter } from 'next/navigation'
import styles from './Header.module.css'
import { useEffect, useState } from 'react'
import DropDown from '../DropDown/DropDown'
import { MONTH } from '@/utils/dateUtils'
import Image from 'next/image'

interface CalendarPageHeaderProps {
  id: string
  year: string
  month: string
  options: CalendarPageHeaderOptions[]
}

export interface CalendarPageHeaderOptions {
  id: string
  name: string
  type: string
}

const CalendarPageHeader = ({
  id,
  year,
  month,
  options,
}: CalendarPageHeaderProps) => {
  const [schedulesOptions, setSchedulesOptions] = useState<string[]>()
  const [scheduleName, setScheduleName] = useState<string>(id)
  const router = useRouter()

  const onNewQueryClicl = (query: string) => {
    router.replace(query)
  }

  useEffect(() => {
    const paramsOptions = options.find((value) => value.id === id)
    setScheduleName(paramsOptions?.name ?? id)
    const str: string[] = []
    options.forEach((value) => {
      str.push(value.name)
    })
    setSchedulesOptions(str)
  }, [options])

  const onSelectedDwropDown = async (
    selected: string,
    selecteIndex: number
  ) => {
    switch (selecteIndex) {
      case 0:
        const selectedOptions = options.find((value) => value.name === selected)
        setScheduleName(selectedOptions?.name ?? '')
        onNewQueryClicl(
          `/calendar?type=${selectedOptions?.type}&id=${selectedOptions?.id}&year=${year}&month=${month}`
        )
        break
      case 1:
        onNewQueryClicl(
          `/calendar?type=user&id=6376611308&year=${selected}&month=${month}`
        )
        break
      case 2:
        onNewQueryClicl(
          `/calendar?type=user&id=6376611308&year=${year}&month=${selected}`
        )
        break
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
          className={`${styles.menuButton} ${styles.iconButton}`}
          onClick={() => {
            router.push('/setting')
          }}
        >
          <Image
            src="/setting.svg"
            alt="Настройки"
            width={24}
            height={24}
            priority={true}
          />
        </button>
        <DropDown
          className={styles.menuButton}
          key={'id'}
          options={schedulesOptions ?? []}
          onSelected={onSelectedDwropDown}
          index={0}
          style={{
            cursor: 'pointer',
          }}
        >
          {scheduleName ?? ''}
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
          onSelected={onSelectedDwropDown}
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
          options={MONTH}
          onSelected={onSelectedDwropDown}
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
