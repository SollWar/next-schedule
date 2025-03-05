'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import CalendarPageHeader, {
  CalendarPageHeaderOptions,
} from './CalendarPageHeader'
import SettingPageHeader from './SettingPageHeader'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import useUserInit from '@/hooks/useUserInit'
import { useEffect, useState } from 'react'
import { JobsData, UserData } from '@/types/firestore-data'
import userStore from '@/store/userStore'

// interface HeaderProps {
//   onNewQueryClicl: (query: string) => void
//   currentScheduleName: string
//   children: React.ReactNode
// }

const Header = () => {
  const { user } = useUserInit()
  //const [userData, setUserData] = useState<UserData>()
  const [calendarPageHeaderOptions, setCalendarPageHeaderOptions] =
    useState<CalendarPageHeaderOptions[]>()
  const { userData, uid, loading } = userStore()

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
    if (user) {
      const userDocRef = doc(db, 'users', user.uid)
      const docSnapshot = await getDoc(userDocRef)

      const userData = docSnapshot.data() as UserData

      //setUserData(userData)

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
      const jobsList = querySnapshot.docs.map((doc) => doc.data() as JobsData)

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
    getUserData()
    console.log(userData)
  }, [user])

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
