import { useEffect, useState } from 'react'
import useTelegramScript from './useTelegramScript'
import {
  //browserSessionPersistence,
  getAuth,
  //setPersistence,
  signInWithCustomToken,
} from 'firebase/auth'
import useUserAuth from './useUserAuth'

const useFakeUserInit = () => {
  const { isLoaded, initData } = useTelegramScript()
  const { user, loading } = useUserAuth()

  const [validationResult, setValidationResult] = useState('')
  const [loginResult, setLoginResult] = useState('')

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
    await firebaseLogin('6376611308')
  }

  const firebaseLogin = async (telegramID?: string) => {
    if (telegramID) {
      const res = await fetch('api/firebase_auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegramID }),
      })

      const { customToken } = await res.json()
      setLoginResult(customToken ? '✓' : 'X')

      if (customToken) {
        //await setPersistence(auth, browserSessionPersistence)
        await signInWithCustomToken(auth, customToken)
      }
    }
  }

  return { user, validationResult, loginResult }
}

export default useFakeUserInit // <-- экспортируем с новым названием
