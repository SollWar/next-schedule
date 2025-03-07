'use client'
import { useEffect, useState } from 'react'
import styles from './page.module.css'
import { JobData, UserData } from '@/types/firestore-data'
import CalendarGrid, {
  CalendarGridProps,
} from '@/components/CalendarGrid/CalendarGrid'
import { useSearchParams } from 'next/navigation'
import Loader from '@/components/Loader/Loader'
import {
  getDaysInMonth,
  getFirstWeekdayOfMonth,
  MONTH,
} from '@/utils/dateUtils'
import {
  generateSchedule,
  setNewSchedule,
} from '@/server/schedule_update/actions'
import scheduleStore from '@/store/scheduleStore'

const Calendar = () => {
  const [calendarGridProps, setCalendarGridProps] =
    useState<CalendarGridProps>()
  const userData = scheduleStore((state) => state.userData)
  const jobData = scheduleStore((state) => state.jobData)
  const subscribeToUser = scheduleStore((state) => state.subscribeToUser)
  const subscribeToJob = scheduleStore((state) => state.subscribeToJob)
  // const unsubscribeToUser = scheduleStore((state) => state.unsubscribeUser)
  // const unsubscribeToJob = scheduleStore((state) => state.unsubscribeJob)
  const loading = scheduleStore((state) => state.loading)
  const error = scheduleStore((state) => state.error)

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
    await setNewSchedule({
      newSchedule,
      type,
      id,
      year,
      month,
      usersId,
    })
  }

  const handleChildButtonClick = (newSchedule: string[]) => {
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
    if (type == 'user') {
      if (id != null && year != null && month != null) {
        subscribeToUser(id)
      }
    } else if (type == 'job') {
      if (id != null && year != null && month != null) {
        subscribeToJob(id)
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (!loading) {
      if (type == 'user') {
        if (id != null && year != null && month != null) {
          handleUserData(id, year, month)
        }
      } else if (type == 'job') {
        if (id != null && year != null && month != null) {
          handleJobData(id, year, month)
        }
      }
    }
  }, [loading])

  useEffect(() => {
    if (error != null) {
      console.warn(error)
    }
  }, [error])

  const handleJobData = async (jobId: string, year: string, month: string) => {
    try {
      if (jobData != null) {
        const currentUserData = userData as UserData[]

        // Кол-во дней в месяце для генерации расписания
        const monthLength = getDaysInMonth(
          Number.parseInt(year),
          MONTH.indexOf(month)
        )

        // Расписания для пользователей
        const usersSchedules: string[][] = new Array(
          currentUserData.length
        ).fill(new Array(monthLength))

        // Получает или генерирует расписание
        for (let i = 0; i < usersSchedules.length; i++) {
          if (currentUserData[i].schedule[year]?.[month]) {
            usersSchedules[i] =
              currentUserData[i].schedule[year]?.[month].split(',')
          } else {
            usersSchedules[i] = await generateSchedule(
              currentUserData[i].id,
              year,
              month
            )
          }
        }

        // Суммарное расписание
        const summarySchedule: string[] = new Array(monthLength).fill(0)

        for (let i = 0; i < monthLength; i++) {
          for (let j = 0; j < currentUserData.length; j++) {
            if (usersSchedules[j][i] == jobId) {
              // Если расписания совпадают то ошибку в расписание
              if (summarySchedule[i] != '0') {
                summarySchedule[i] = 'error'
              } else {
                summarySchedule[i] = currentUserData[j].id
              }
            }
          }
        }

        const entityIds: string[] = []
        const entityNames: string[] = []
        const entityColors: string[] = ['#FFFFFF']

        currentUserData.forEach((user) => {
          entityIds.push(user.id)
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
          entityIds: entityIds,
          entityNames: entityNames,
          entityColors: entityColors,
        })
      }
    } catch (error) {
      console.warn(error)
    }
  }

  const handleUserData = async (
    userId: string,
    year: string,
    month: string
  ) => {
    try {
      if (userData != null) {
        const currentUserData: UserData = userData as UserData
        const currentJobData: JobData[] = jobData as JobData[]
        const schedule =
          currentUserData.schedule[year]?.[month] ??
          (await generateSchedule(userId, year, month)).join(',')

        const entityIds = currentUserData.jobs
        const entityNames: string[] = []
        const entityColors: string[] = ['#FFFFFF']

        currentJobData.forEach((job) => {
          entityNames.push(job.job_name)
          entityColors.push(job.job_color)
        })

        setCalendarGridProps({
          schedule: schedule.split(','),
          entityIds: entityIds,
          entityNames: entityNames,
          entityColors: entityColors,
        })
      }
    } catch (error) {
      console.warn(error)
    }
  }

  const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.content}>
          {' '}
          <div className={styles.grid_container}>
            {weekDays.map((day, index) => (
              <div key={index} className={styles.grid_week_days}>
                {day}
              </div>
            ))}
          </div>
          <Loader
            isLoading={loading}
            days={getDaysInMonth(
              Number.parseInt(year ?? '2025'),
              MONTH.indexOf(month ?? 'Январь')
            )}
            fakeDays={
              getFirstWeekdayOfMonth(
                Number.parseInt(year ?? '2025'),
                MONTH.indexOf(month ?? 'Январь')
              ) - 1
            }
          >
            {calendarGridProps == undefined ? null : (
              <CalendarGrid
                schedule={calendarGridProps.schedule}
                entityIds={calendarGridProps.entityIds}
                entityNames={calendarGridProps.entityNames}
                entityColors={calendarGridProps.entityColors}
                onAcceptClick={handleChildButtonClick}
              />
            )}
          </Loader>{' '}
        </div>
      </div>
    </div>
  )
}

export default Calendar
