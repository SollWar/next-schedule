'use client'

import userInit from '@/hooks/userInit'
import Image from 'next/image'
import './loading.css'
import styles from './page.module.css'

export default function Home() {
  const { user, validationResult, loginResult } = userInit()

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
          <div className={user?.uid == null ? 'loading-dots' : ''}>
            Авторизация {user?.uid ? '✓' : ''}
          </div>
        </div>
      </div>
    </div>
  )
}
