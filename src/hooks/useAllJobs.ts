'use client'
import { db } from '@/lib/firebase'
import { JobData, UserData } from '@/types/firestore-data'
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'

const useAllJobs = () => {
  const [jobs, setJobs] = useState<JobData[] | null>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null | unknown>(null)

  const setState = (
    jobs: JobData[] | null,
    loading: boolean,
    error: string | null | unknown
  ) => {
    setJobs(jobs)
    setLoading(loading)
    setError(error)
  }

  useEffect(() => {
    fetchAllJobs()
  }, [])

  const fetchAllJobs = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'jobs'))

      if (!snapshot.empty) {
        const jobs = await snapshot.docs.map((doc) => ({
          ...(doc.data() as JobData),
        }))
        setState(jobs, false, null)
      } else {
        setState(null, false, 'Документ не существует')
      }
    } catch (error) {
      setState(null, false, error)
    }
  }

  return { jobs, loading, error }
}

export default useAllJobs
