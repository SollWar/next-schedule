import { useEffect, useState } from 'react'
import useTelegramScript from './useTelegramScript'
import {
  //browserSessionPersistence,
  getAuth,
  //setPersistence,
  signInWithCustomToken,
} from 'firebase/auth'
import useUserAuth from './useUserAuth'

const useUserInit = () => {
  const { isLoaded, initData } = useTelegramScript()
  const { user, loading } = useUserAuth()

  const [authResult, setAuthResult] = useState('')

  const auth = getAuth()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        if (isLoaded) {
          startAuth()
        }
      }
    }
  }, [isLoaded, loading])

  const startAuth = async () => {
    await firebaseAuth()
  }

  const firebaseAuth = async () => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initData }),
    })

    const { customToken } = await res.json()

    setAuthResult(customToken ? '✓' : 'X')
    if (customToken) {
      signInWithCustomToken(auth, customToken)
    }
  }

  return { user, authResult }
}

export default useUserInit // <-- экспортируем с новым названием
