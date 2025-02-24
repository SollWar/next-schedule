'use client'
import { getDaysInMonth, getFirstWeekdayOfMonth } from '@/utils/dateUtils'
import styles from './CalendarGrid.module.css'
import { JobsData } from '@/types/firestore-data'
import { getContrastTextColor } from '@/utils/colorsUtils'
import Loader from '../Loader/Loader'
//import { useState } from 'react'

interface CalendarGridProps {
  schedule: string
  jobs: string[]
  jobsDataList: JobsData[]
  isLoading: boolean
}

const CalendarGrid = ({
  schedule,
  jobs,
  jobsDataList,
  isLoading,
}: CalendarGridProps) => {
  // Преобразуем строку в массив элементов
  const days = schedule.split(',')
  const onlyJobs = jobs.filter((item) => item !== '0')
  const firstWeekdayOfMonth = getFirstWeekdayOfMonth(2025, 1)
  // Пустые дни
  const fakeDays = new Array(firstWeekdayOfMonth - 1).fill(0)

  const jobsColor = ['#FFFFFF']

  const jobCount = new Array(days.length).fill(0)

  const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']

  jobsDataList.map((job) => {
    jobsColor.push(job.job_color)
  })

  days.map((day) => {
    onlyJobs.map((job, index) => {
      if (day == job) {
        jobCount[index]++
      }
    })
  })

  return (
    <>
      <div className={styles.grid_container}>
        {weekDays.map((day, index) => (
          <div key={index} className={styles.grid_week_days}>
            {day}
          </div>
        ))}
      </div>
      <Loader
        isLoading={isLoading}
        days={getDaysInMonth(2025, 2)}
        fakeDays={getFirstWeekdayOfMonth(2025, 1) - 1}
      >
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
                      : getContrastTextColor(jobsColor[Number(day)]),
                  backgroundColor: jobsColor[Number(day)],
                }}
              >
                {index + 1}
              </a>
            ))}
          </div>
          <div className={styles.job_container}>
            {jobsDataList.map((job, index) => (
              <div
                key={job.job_name}
                className={styles.job_item}
                style={{
                  color: getContrastTextColor(jobsColor[Number(index + 1)]),
                  backgroundColor: jobsColor[index + 1],
                }}
              >
                {job.job_name}
                <div
                  style={{
                    height: '1px',
                    width: '100%',
                    backgroundColor: 'black',
                  }}
                ></div>
                <div
                  style={{
                    color: getContrastTextColor(jobsColor[Number(index + 1)]),
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
      </Loader>
    </>
  )
}

export default CalendarGrid
