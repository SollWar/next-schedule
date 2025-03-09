'use client'
import { db } from '@/lib/firebase'
import { UserData } from '@/types/firestore-data'
import { doc, getDoc } from 'firebase/firestore'
import { use, useEffect, useState } from 'react'

const User = ({ params }: { params: Promise<{ user: string }> }) => {
  const [userData, setUserData] = useState<UserData>()
  const { user } = use(params)

  useEffect(() => {
    getUserData(user)
  }, [])
  const getUserData = async (user: string) => {
    const jobRef = doc(db, 'users', user)
    const docSnapshot = await getDoc(jobRef)
    const userData = {
      ...(docSnapshot.data() as UserData),
      id: docSnapshot.id,
    }

    setUserData(userData)
  }

  return (
    <div>
      <p>{userData ? userData.id : 'asd'}</p>
    </div>
  )
}

export default User
