'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import CalendarPageHeader, {
  CalendarPageHeaderOptions,
} from './CalendarPageHeader'
import SettingPageHeader from './SettingPageHeader'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import useUserInit from '@/hooks/useUserInit'
import { useEffect, useState } from 'react'
import { JobData } from '@/types/firestore-data'
import userStore from '@/store/userStore'

const Header = () => {
  const { user } = useUserInit()
  //const [userData, setUserData] = useState<UserData>()
  const [calendarPageHeaderOptions, setCalendarPageHeaderOptions] =
    useState<CalendarPageHeaderOptions[]>()
  const userData = userStore((state) => state.userData)
  const uid = userStore((state) => state.uid)
  const isInitialized = userStore((state) => state.isInitialized)
  const subscribeToUser = userStore((state) => state.subscribeToUser)

  //scheduleStore((state) => state.subscribeToUser)

  const searchParams = useSearchParams()
  //const type = searchParams.get('type')
  const id = searchParams.get('id')
  const year = searchParams.get('year')
  const month = searchParams.get('month')

  const pathname = usePathname()
  const isSettingsPage = pathname.startsWith('/setting')
  const isCalendarPage = pathname.startsWith('/calendar')
  const isMainPage = pathname.endsWith('/')

  const getUserData = async () => {
    if (userData && user) {
      const calendarPageHeaderOptionsList: CalendarPageHeaderOptions[] = []

      calendarPageHeaderOptionsList.push({
        id: 'users',
        name: 'users',
        type: 'users',
      })
      calendarPageHeaderOptionsList.push({
        id: user.uid,
        name: userData.user_name,
        type: 'user',
      })
      calendarPageHeaderOptionsList.push({
        id: 'jobs',
        name: 'jobs',
        type: 'jobs',
      })

      const q = query(
        collection(db, 'jobs'),
        where('users', 'array-contains', user.uid)
      )

      const querySnapshot = await getDocs(q)
      const jobsList = querySnapshot.docs.map((doc) => doc.data() as JobData)

      for (let i = 0; i < userData.jobs.length; i++) {
        calendarPageHeaderOptionsList.push({
          id: userData.jobs[i],
          name: jobsList[i].job_name,
          type: 'job',
        })
      }

      setCalendarPageHeaderOptions(calendarPageHeaderOptionsList)
    }
  }

  useEffect(() => {
    if (user) {
      if (!isInitialized) {
        subscribeToUser(user.uid)
      }
    }
  }, [user])

  useEffect(() => {
    if (userData) {
      getUserData()
    }
  }, [userData])

  if (isMainPage) return <></>
  else if (isSettingsPage) return <SettingPageHeader userId={uid ?? ''} />
  else if (isCalendarPage)
    return (
      <CalendarPageHeader
        id={id ?? ''}
        options={
          calendarPageHeaderOptions ?? [
            { id: '', name: userData?.user_name ?? '', type: '' },
          ]
        }
        year={year ?? ''}
        month={month ?? ''}
      />
    )
}

export default Header
