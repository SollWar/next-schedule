'use client'
import { useRouter } from 'next/navigation'
import styles from './Header.module.css'

const SettingPageHeader = () => {
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
      <div>Настройки</div>
    </header>
  )
}

export default SettingPageHeader
