'use client'

import Image from 'next/image'
import styles from './page.module.css'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MONTH } from '@/utils/dateUtils'
import useUserInit from '@/hooks/useUserInit'

export default function Home() {
  const { user, authResult } = useUserInit()
  const router = useRouter()

  useEffect(() => {
    console.log(authResult)
    if (user?.uid) {
      const year = new Date().getFullYear()
      const month = new Date().getMonth()

      setTimeout(() => {
        router.replace(
          `/calendar?type=user&id=${user.uid}&year=${year}&month=${MONTH[month]}`
        )
      }, 50)
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
          priority={true} // Для критически важных изображений
        />
        <div className={styles.loader}></div>
        <div className={styles.error_message}>{authResult}</div>
      </div>
    </div>
  )
}
