'use client'

import Image from 'next/image'
import styles from './page.module.css'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MONTH } from '@/utils/dateUtils'
import useUserInit from '@/hooks/useUserInit'
import userStore from '@/store/userStore'

export default function Home() {
  const { user, authResult } = useUserInit()
  const { loading, subscribeToDocument } = userStore()
  const router = useRouter()

  useEffect(() => {
    if (user?.uid) {
      const year = new Date().getFullYear()
      const month = new Date().getMonth()

      const unsubscribe = subscribeToDocument()
      if (!loading) {
        router.replace(
          `/calendar?type=user&id=${user.uid}&year=${year}&month=${MONTH[month]}`
        )

        return () => {
          unsubscribe()
        }
      }
    }
  }, [user, router, loading])

  return (
    <div className={styles.main}>
      <div className={styles.body}>
        <Image
          src="/icon.png"
          alt="Описание изображения"
          width={128}
          height={128}
          priority={true} // Для критически важных изображений
        />
        <div className={styles.loader}></div>
        <div className={styles.error_message}>{authResult}</div>
      </div>
    </div>
  )
}
