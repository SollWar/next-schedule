'use client'

import Image from 'next/image'
import styles from './page.module.css'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthInit from '@/hooks/useAuthInit'
import { MONTH } from '@/utils/dateUtils'

export default function Home() {
  const { user, authResult } = useAuthInit()
  const router = useRouter()

  useEffect(() => {
    if (user?.uid) {
      const year = new Date().getFullYear()
      const month = new Date().getMonth()

      setTimeout(() => {
        router.replace(
          `/calendar?type=user&id=6376611308&year=${year}&month=${MONTH[month]}`
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
      </div>
    </div>
  )
}
