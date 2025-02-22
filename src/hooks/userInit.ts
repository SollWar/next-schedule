import { useEffect, useState } from 'react'
import userAuth from './userAuth'
import useTelegramScript from './useTelegramScript'
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInWithCustomToken,
} from 'firebase/auth'

const userInit = () => {
  const { isLoaded, initData } = useTelegramScript()

  const { user, loading } = userAuth()

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
    await firebaseLogin(await telegramValidation())
  }

  const telegramValidation = async () => {
    const res = await fetch('/api/telegram_auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initData }),
    })

    const { telegramID } = await res.json()

    setValidationResult(telegramID ? '✓' : 'X')
    return telegramID
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
        await setPersistence(auth, browserSessionPersistence)
        await signInWithCustomToken(auth, customToken)
      }
    }
  }

  return { user, validationResult, loginResult }
}

export default userInit
