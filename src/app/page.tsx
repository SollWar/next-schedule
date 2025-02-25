'use client'

import useAuthInit from '@/hooks/useAuthInit'
import Image from 'next/image'
import styles from './page.module.css'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useFakeAuthInit from '@/hooks/useFakeAuthInit'

export default function Home() {
  ///TODO(Заменить перед публикацией)
  const { user, validationResult, loginResult } = useFakeAuthInit()
  const router = useRouter()

  useEffect(() => {
    if (user?.uid) {
      setTimeout(() => {
        router.replace(
          '/calendar?type=user&id=6376611308&year=2025&month=Февраль'
        )
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
