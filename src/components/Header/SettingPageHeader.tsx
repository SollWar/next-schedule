'use client'
import { useRouter } from 'next/navigation'
import styles from './Header.module.css'

interface SettingPageHeaderProps {
  userId: string
}

const SettingPageHeader = ({ userId }: SettingPageHeaderProps) => {
  const router = useRouter()

  return (
    <header className={styles.header}>
      <button
        onClick={() => {
          router.back()
        }}
        className={styles.menu_button}
      >
        Назад
      </button>
      <div className={styles.header_div}>ID: {userId}</div>
    </header>
  )
}

export default SettingPageHeader
