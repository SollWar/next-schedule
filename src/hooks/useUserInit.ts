'use client'
import { useEffect, useState } from 'react'
import useTelegramScript from './useTelegramScript'
import { getAuth, signInWithCustomToken } from 'firebase/auth'
import useUserAuth from './useUserAuth'

import { getCustomTokenAction } from '@/server/auth/actions'

const useUserInit = () => {
  const { isLoaded, initData } = useTelegramScript()
  const { user, loading } = useUserAuth()
  const [authResult, setAuthResult] = useState('')
  const auth = getAuth()

  useEffect(() => {
    if (!loading && !user && isLoaded) {
      startAuth()
    }
  }, [isLoaded, loading, initData, user])

  const startAuth = async () => {
    try {
      const customToken = await getCustomTokenAction(initData as string)
      setAuthResult(customToken ? '✓' : 'X')
      if (customToken) {
        await signInWithCustomToken(auth, customToken)
      }
    } catch (error) {
      console.error(error)
      setAuthResult('Error')
    }
  }

  return { user, authResult }
}

export default useUserInit
