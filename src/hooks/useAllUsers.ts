'use client'
import { db } from '@/lib/firebase'
import { UserData } from '@/types/firestore-data'
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'

const useAllUsers = () => {
  const [users, setUsers] = useState<UserData[] | null>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null | unknown>(null)

  const setState = (
    users: UserData[] | null,
    loading: boolean,
    error: string | null | unknown
  ) => {
    setUsers(users)
    setLoading(loading)
    setError(error)
  }

  useEffect(() => {
    fetchAllUsers()
  }, [])

  const fetchAllUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'))

      if (!snapshot.empty) {
        const users = await snapshot.docs.map((doc) => ({
          ...(doc.data() as UserData),
          id: doc.id,
        }))
        setState(users, false, null)
      } else {
        setState(null, false, 'Документ не существует')
      }
    } catch (error) {
      setState(null, false, error)
    }
  }

  return { users, loading, error }
}

export default useAllUsers
