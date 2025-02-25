'use client'
import { getDaysInMonth, getFirstWeekdayOfMonth } from '@/utils/dateUtils'
import styles from './CalendarGrid.module.css'
import { JobsData } from '@/types/firestore-data'
import { getContrastTextColor } from '@/utils/colorsUtils'
import Loader from '../Loader/Loader'
//import { useState } from 'react'

interface CalendarGridProps {
  schedule: string
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
  // Преобразуем строку в массив элементов
  const days = schedule.split(',')
  const firstWeekdayOfMonth = getFirstWeekdayOfMonth(2025, 1)
  // Пустые дни
  const fakeDays = new Array(firstWeekdayOfMonth - 1).fill(0)

  const jobCount = new Array(days.length).fill(0)

  days.map((day) => {
    entityIds.map((job, index) => {
      if (day == job) {
        jobCount[index]++
      }
    })
  })

  return (
    <>
      <div className={styles.grid_container}>
        {fakeDays.map((_, index) => (
          <div key={`fake-${index}`} className={styles.grid_item}></div>
        ))}
        {days.map((day, index) => (
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
    </>
  )
}

export default CalendarGrid
