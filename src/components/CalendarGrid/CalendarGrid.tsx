'use client'
import { getDaysInMonth, getFirstWeekdayOfMonth } from '@/utils/dateUtils'
import styles from './CalendarGrid.module.css'
import { JobsData } from '@/types/firestore-data'
import { getContrastTextColor } from '@/utils/colorsUtils'
import Loader from '../Loader/Loader'
import { useEffect, useState } from 'react'
//import { useState } from 'react'

interface CalendarGridProps {
  schedule: string[]
  entityIds: string[]
  entityNames: string[]
  entityColors: string[]
}

const CalendarGrid = ({
  schedule,
  entityIds,
  entityNames,
  entityColors,
}: CalendarGridProps) => {
  const [show, setShow] = useState(false)
  // Преобразуем строку в массив элементов
  const firstWeekdayOfMonth = getFirstWeekdayOfMonth(2025, 1)
  // Пустые дни
  const fakeDays = new Array(firstWeekdayOfMonth - 1).fill(0)

  const jobCount = new Array(schedule.length).fill(0)

  schedule.map((day) => {
    entityIds.map((job, index) => {
      if (day == job) {
        jobCount[index]++
      }
    })
  })

  const shangeShow = () => {
    setShow(!show)
  }

  useEffect(() => {
    setTimeout(() => {
      shangeShow()
    }, 5)
  }, [])

  return (
    <div className={show ? styles.animOn : styles.animOff}>
      <div className={styles.grid_container}>
        {fakeDays.map((_, index) => (
          <div key={`fake-${index}`} className={styles.grid_item}></div>
        ))}
        {schedule.map((day, index) => (
          <a
            onClick={() => {}}
            className={styles.grid_item}
            key={`day-${index}`}
            style={{
              cursor: 'pointer',
              color:
                day == '0'
                  ? 'black'
                  : getContrastTextColor(
                      entityColors[entityIds.indexOf(day) + 1]
                    ),
              backgroundColor: entityColors[entityIds.indexOf(day) + 1],
            }}
          >
            {index + 1}
          </a>
        ))}
      </div>
      <div className={styles.job_container}>
        {entityIds.map((job, index) => (
          <div
            key={entityNames[index]}
            className={styles.job_item}
            style={{
              color: getContrastTextColor(entityColors[Number(index + 1)]),
              backgroundColor: entityColors[index + 1],
            }}
          >
            {entityNames[index]}
            <div
              style={{
                height: '1px',
                width: '100%',
                backgroundColor: 'black',
              }}
            ></div>
            <div
              style={{
                color: getContrastTextColor(entityColors[Number(index + 1)]),
              }}
              className={styles.job_item}
            >
              {jobCount[index]}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarGrid
