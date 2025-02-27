'use client'
import { db } from '@/lib/firebase'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import styles from './page.module.css'
//import { FirebaseError } from 'firebase/app'
import { JobsData, UserData } from '@/types/firestore-data'
import CalendarGrid from '@/components/CalendarGrid/CalendarGrid'
import { useRouter, useSearchParams } from 'next/navigation'
import Loader from '@/components/Loader/Loader'
import { getDaysInMonth, getFirstWeekdayOfMonth } from '@/utils/dateUtils'
import ResponsiveLayout from '@/components/ResponsiveLayout/ResponsiveLayout'

const Calendar = () => {
  const [schedule, setSchedule] = useState<string[]>([])
  //const [error, setError] = useState<string>(''
  const [isLoading, setIsLoading] = useState(true)

  const [entityIds, setEntityIds] = useState<string[]>()
  const [entityNames, setEntityNames] = useState<string[]>()
  const [entityColors, setEntityColors] = useState<string[]>([])
  const router = useRouter()

  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  const id = searchParams.get('id')
  const year = searchParams.get('year')
  const month = searchParams.get('month')

  const scheduleUpdate = async (
    newSchedule: string[],
    type: string,
    id: string,
    year: string,
    month: string,
    usersId: string[]
  ) => {
    const res = await fetch('/api/schedule_update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newSchedule, type, id, year, month, usersId }),
    })

    await res.json()
    if (type == 'user') {
      handleUserData(id, year, month)
      getJobsName(id)
    } else if (type == 'job') {
      handleJobData(id)
    }
  }

  const handleChildButtonClick = (newSchedule: string[]) => {
    setIsLoading(true)
    scheduleUpdate(
      newSchedule,
      type ?? '',
      id ?? '',
      year ?? '',
      month ?? '',
      entityIds ?? []
    )
  }

  const onNewQueryClicl = (query: string) => {
    router.replace(query)
    setIsLoading(true)
  }

  useEffect(() => {
    if (type == 'user') {
      if (id != null && year != null && month != null) {
        handleUserData(id, year, month)
        getJobsName(id)
      }
    } else if (type == 'job') {
      if (id != null && year != null && month != null) {
        handleJobData(id)
      }
    }
  }, [type, id, year, month])

  const handleJobSchedule = async (
    jobId: string,
    usersIds: string[],
    year: string,
    month: string
  ) => {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        where('__name__', 'in', usersIds)
      ) // Firestore позволяет max 30 ID в `in`
      const querySnapshot = await getDocs(usersQuery)

      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as UserData),
      }))

      const monthLength = usersData[0].schedule[year]?.[month].split(',').length

      const summarySchedule: string[] = new Array(monthLength).fill(0)

      for (let i = 0; i < monthLength; i++) {
        for (let j = 0; j < usersData.length; j++) {
          if (usersData[j].schedule[year]?.[month].split(',')[i] == jobId) {
            if (summarySchedule[i] != '0') {
              summarySchedule[i] = 'error'
            } else {
              summarySchedule[i] = usersData[j].id
            }
          }
        }
      }

      const entityIds: string[] = usersIds
      const entityNames: string[] = []
      const entityColors: string[] = ['#FFFFFF']
      usersData.forEach((user) => {
        entityNames.push(user.user_name)
        entityColors.push(user.user_color)
      })
      if (summarySchedule.indexOf('error') != -1) {
        entityColors.push('#ff0000')
        entityNames.push('Совпадают')
        entityIds.push('error')
      }

      setSchedule(summarySchedule)
      setEntityIds(usersIds)
      setEntityNames(entityNames)
      setEntityColors(entityColors)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJobData = async (jobId: string) => {
    try {
      const jobDocRef = doc(db, 'jobs', jobId)
      const docSnapshot = await getDoc(jobDocRef)

      if (!docSnapshot.exists()) {
        throw new Error('Документ не найден')
      }

      const jobData = docSnapshot.data() as JobsData

      handleJobSchedule(jobId, jobData?.users as string[], year!, month!)
    } catch (error) {
      console.log(error)
    }
  }

  const handleUserData = async (
    userId: string,
    year: string,
    month: string
  ) => {
    try {
      const userDocRef = doc(db, 'users', userId)
      const docSnapshot = await getDoc(userDocRef)

      if (!docSnapshot.exists()) {
        throw new Error('Документ не найден')
      }
      const userData = docSnapshot.data() as UserData
      const schedule = userData.schedule[year]?.[month]

      const entityIds = userData.jobs

      setEntityIds(entityIds)

      setSchedule(schedule.split(','))
    } catch (error) {
      console.log(error)
      //setError((error as FirebaseError).message)
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

      const entityNames: string[] = []
      const entityColors: string[] = ['#FFFFFF']
      jobsList.forEach((job) => {
        entityNames.push(job.job_name)
        entityColors.push(job.job_color)
      })

      setEntityNames(entityNames)
      setEntityColors(entityColors)
    } catch (error) {
      console.log(error)
      //setError((error as FirebaseError).message)
    } finally {
      setIsLoading(false)
    }
  }

  const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']

  return (
    <ResponsiveLayout onNewQueryClicl={onNewQueryClicl}>
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
        <CalendarGrid
          schedule={schedule}
          entityIds={entityIds ?? []}
          entityNames={entityNames ?? []}
          entityColors={entityColors}
          onAcceptClick={handleChildButtonClick}
        />
      </Loader>
    </ResponsiveLayout>
  )
}

export default Calendar
