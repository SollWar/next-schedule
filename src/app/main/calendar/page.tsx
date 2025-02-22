'use client'
import Loader from '@/components/Loader/Loader'
import { db } from '@/lib/firebase'
import {
  collection,
  DocumentData,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import styles from './page.module.css'
import { FirebaseError } from 'firebase/app'

interface UserSchedule {
  [year: string]: {
    [month: string]: string
  }
}

interface UserData {
  user_name: string
  schedule: UserSchedule
  user_color: string
  jobs: string[]
}

interface JobsData {
  job_name: string
  users: string[]
  users_rules: string[]
}

/// Количество дней в месяце
function getDaysInMonth(year: number, month: number): number {
  // Месяцы в JavaScript начинаются с 0 (январь = 0)
  // Создаем дату следующего месяца и отнимаем 1 день
  return new Date(year, month, 0).getDate()
}

/// С какого дня недели начинается месяц
function getFirstWeekdayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 7 : day // Воскресенье становится 7
}

/// Генерация числа в диапозоне от min до max
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const CalendarGrid = ({
  schedule,
  onClick,
}: {
  schedule: string
  onClick: (key: string) => {}
}) => {
  // Преобразуем строку в массив элементов
  const days = schedule.split(',')
  const firstWeekdayOfMonth = getFirstWeekdayOfMonth(2025, 2)
  const fakeDays = new Array(firstWeekdayOfMonth - 1).fill(0)

  return (
    <div className={styles.grid_container}>
      {fakeDays.map((day, index) => (
        <div key={`fake-${index}`} className={styles.grid_item}></div>
      ))}
      {days.map((day, index) => (
        <a
          onClick={() => onClick((index + 1).toString())}
          className={styles.grid_item}
          key={`day-${index}`}
          style={{
            backgroundColor: day === '1' ? '#4CAF50' : '#ff5252',
          }}
        >
          {index + 1} {/* Номер дня */}
        </a>
      ))}
    </div>
  )
}

const Calendar = () => {
  const [schedule, setSchedule] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [jobs, setJobs] = useState<JobsData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [clickKeyGrid, setClickKeyGrid] = useState('')

  useEffect(() => {
    handleUserData()
    getJobsName('6376611308')
  })

  const handleUserData = async () => {
    try {
      const userDoc = await collection(db, 'users')
      const getDoc = await getDocs(userDoc)
      const usersList = getDoc.docs.map((doc) => doc.data() as UserData)
      const februaryDays = usersList[0]?.schedule['2025']?.['Февраль']
      setSchedule(februaryDays)
    } catch (error) {
      setError((error as FirebaseError).message)
    } finally {
      setIsLoading(false)
    }
  }

  const getJobsName = async (userId: string) => {
    try {
      const q = query(
        collection(db, 'jobs'),
        where('users', 'array-contains', userId)
      )

      const querySnapshot = await getDocs(q)
      const jobsList = querySnapshot.docs.map((doc) => doc.data() as JobsData)

      setJobs(jobsList)
    } catch (error) {
      setError((error as FirebaseError).message)
    }
  }

  const clickHandle = (key: string) => {
    setClickKeyGrid(key)
    return ''
  }

  return (
    <Loader isLoading={isLoading} text="Загружаем расписание...">
      {error == '' ? (
        <div>
          <h1>Добро пожаловать на страницу Calendar!</h1>
          <p>Это страница с расписанием!</p>
          <p>{clickKeyGrid}</p>
          <p>
            {jobs.map((job) => (
              <a> {job.job_name}</a>
            ))}
          </p>
          <CalendarGrid
            schedule={schedule}
            onClick={(key) => clickHandle(key)}
          />
        </div>
      ) : (
        error
      )}
    </Loader>
  )

  // const [logs, setLogs] = useState<string[]>([])

  // useEffect(() => {
  //   const logger = (...args: any[]) => {
  //     setLogs((prev) => [
  //       ...prev,
  //       args
  //         .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : arg))
  //         .join(' '),
  //     ])
  //   }

  //   window.console.log = logger
  //   window.console.error = logger
  //   window.console.warn = logger

  //   return () => {
  //     window.console.log = console.log
  //     window.console.error = console.error
  //     window.console.warn = console.warn
  //   }
  // }, [])

  // return (
  //   <div style={{ border: '1px solid #ccc', padding: '10px' }}>
  //     <h3>Консоль:</h3>
  //     <div style={{ height: '200px', overflowY: 'auto' }}>
  //       {logs.map((log, index) => (
  //         <div key={index} style={{ fontFamily: 'monospace' }}>
  //           {log}
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // )
}

export default Calendar
