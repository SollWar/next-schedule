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
import { JobsData, UserData } from '@/types/firestore-data'
import CalendarGrid, {
  CalendarGridProps,
} from '@/components/CalendarGrid/CalendarGrid'
import { useRouter, useSearchParams } from 'next/navigation'
import Loader from '@/components/Loader/Loader'
import {
  getDaysInMonth,
  getFirstWeekdayOfMonth,
  MONTH,
} from '@/utils/dateUtils'
import ResponsiveLayout from '@/components/ResponsiveLayout/ResponsiveLayout'
import {
  generateSchedule,
  setNewSchedule,
} from '@/server/schedule_update/actions'

const Calendar = () => {
  const [calendarGridProps, setCalendarGridProps] =
    useState<CalendarGridProps>()
  const [isLoading, setIsLoading] = useState(true)
  const [scheduleName, setScheduleName] = useState('')
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
    const res = await setNewSchedule({
      newSchedule,
      type,
      id,
      year,
      month,
      usersId,
    })

    if (type == 'user') {
      handleUserData(id, year, month)
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
      calendarGridProps?.entityIds ?? []
    )
  }

  useEffect(() => {
    setIsLoading(true)
    if (type == 'user') {
      if (id != null && year != null && month != null) {
        handleUserData(id, year, month)
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
    month: string,
    jobName: string
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

      const monthLength = getDaysInMonth(
        Number.parseInt(year),
        MONTH.indexOf(month)
      )

      const usersSchedules: string[][] = new Array(usersIds.length).fill(
        new Array(monthLength)
      )

      for (let i = 0; i < usersSchedules.length; i++) {
        if (usersData[i].schedule[year]?.[month]) {
          usersSchedules[i] = usersData[i].schedule[year]?.[month].split(',')
        } else {
          usersSchedules[i] = await generateSchedule(
            usersData[i].id,
            year,
            month
          )
        }
      }

      const summarySchedule: string[] = new Array(monthLength).fill(0)

      for (let i = 0; i < monthLength; i++) {
        for (let j = 0; j < usersData.length; j++) {
          if (usersSchedules[j][i] == jobId) {
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
      setCalendarGridProps({
        schedule: summarySchedule,
        entityIds: usersIds,
        entityNames: entityNames,
        entityColors: entityColors,
      })
      setScheduleName(jobName)
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

      handleJobSchedule(
        jobId,
        jobData?.users as string[],
        year!,
        month!,
        jobData?.job_name
      )
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
      const schedule =
        userData.schedule[year]?.[month] ??
        (await generateSchedule(userId, year, month)).join(',')

      const entityIds = userData.jobs

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

      setCalendarGridProps({
        schedule: schedule.split(','),
        entityIds: entityIds,
        entityNames: entityNames,
        entityColors: entityColors,
      })
      setScheduleName(userData.user_name)
    } catch (error) {
      console.log(error)
      //setError((error as FirebaseError).message)
    } finally {
      setIsLoading(false)
    }
  }

  // const getJobsName = async (userId: string) => {
  //   try {
  //     const q = query(
  //       collection(db, 'jobs'),
  //       where('users', 'array-contains', userId)
  //     )

  //     const querySnapshot = await getDocs(q)
  //     const jobsList = querySnapshot.docs.map((doc) => doc.data() as JobsData)

  //     const entityNames: string[] = []
  //     const entityColors: string[] = ['#FFFFFF']
  //     jobsList.forEach((job) => {
  //       entityNames.push(job.job_name)
  //       entityColors.push(job.job_color)
  //     })

  //     setEntityNames(entityNames)
  //     setEntityColors(entityColors)
  //   } catch (error) {
  //     console.log(error)
  //     //setError((error as FirebaseError).message)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']

  return (
    <ResponsiveLayout>
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
          schedule={calendarGridProps?.schedule ?? []}
          entityIds={calendarGridProps?.entityIds ?? []}
          entityNames={calendarGridProps?.entityNames ?? []}
          entityColors={calendarGridProps?.entityColors ?? []}
          onAcceptClick={handleChildButtonClick}
        />
      </Loader>
    </ResponsiveLayout>
  )
}

export default Calendar
