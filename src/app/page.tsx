'use client'

import useAuthInit from '@/hooks/useAuthInit'
import Image from 'next/image'
import styles from './page.module.css'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user, validationResult, loginResult } = useAuthInit()
  const router = useRouter()

  useEffect(() => {
    if (user?.uid) {
      setTimeout(() => {
        router.replace('/calendar')
      }, 10)
    }
  }, [user, router])

  return (
    <div className={styles.main}>
      <div className={styles.body}>
        <Image
          src="/icon.png"
          alt="Описание изображения"
          width={128}
          height={128}
          priority // Для критически важных изображений
        />
        <div className={styles.loading_info}>
          <div
            className={
              validationResult == '' && user == null ? 'loading-dots' : ''
            }
          >
            Получение Telegram ID{' '}
            {validationResult == '' && user != null ? '⎵' : validationResult}
          </div>
          <div
            className={loginResult == '' && user == null ? 'loading-dots' : ''}
          >
            Получение токена Firebase{' '}
            {loginResult == '' && user != null ? '⎵' : loginResult}
          </div>
          <div
            className={
              user?.uid == null
                ? loginResult == 'X'
                  ? ''
                  : 'loading-dots'
                : ''
            }
          >
            Авторизация {user?.uid ? '✓' : loginResult == 'X' ? 'X' : ''}
          </div>
        </div>
      </div>
    </div>
  )
}
