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
//import styles from './page.module.css'
//import { FirebaseError } from 'firebase/app'
import { JobsData, UserData } from '@/types/firestore-data'
import CalendarGrid from '@/components/CalendarGrid/CalendarGrid'

const Calendar = () => {
  const [schedule, setSchedule] = useState<string>('')
  //const [error, setError] = useState<string>('')
  const [jobs, setJobs] = useState<JobsData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData>()

  const year = '2025'
  const month = 'Февраль'

  useEffect(() => {
    handleUserData('6376611308')
    getJobsName('6376611308')
  }, [])

  const handleUserData = async (userId: string) => {
    try {
      const userDocRef = doc(db, 'users', userId)
      const docSnapshot = await getDoc(userDocRef)

      if (!docSnapshot.exists()) {
        throw new Error('Документ не найден')
      }
      const userData = docSnapshot.data() as UserData
      const februaryDays = userData.schedule[year]?.[month]

      setUserData(userData)
      setSchedule(februaryDays)

      // const userDoc = await collection(db, 'users')
      // Получение всех документов и итерация по ним
      // const getDoc = await getDocs(userDoc)
      // const usersList = getDoc.docs.map((doc) => doc.data() as UserData)
      // const februaryDays = usersList[0]?.schedule['2025']?.['Февраль']
      // setSchedule(februaryDays)
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

      setJobs(jobsList)
    } catch (error) {
      console.log(error)
      //setError((error as FirebaseError).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CalendarGrid
      jobsDataList={jobs}
      schedule={schedule}
      jobs={[...new Set(userData?.schedule[year]?.[month].split(','))]}
      isLoading={isLoading}
    />
  )
}

export default Calendar
