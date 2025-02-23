import { onAuthStateChanged, User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth } from '../lib/firebase'

const useUserAuth = () => {
  const [user, setUser] = useState<User | null>(auth.currentUser) // Берём из локального кеша
  const [loading, setLoading] = useState(!auth.currentUser) // Если user есть, сразу false

  useEffect(() => {
    if (auth.currentUser) return // Если пользователь уже есть, не ждём

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { user, loading }
}

export default useUserAuth
