'use client'
import { doc, getDoc } from 'firebase/firestore'
import styles from './page.module.css'
import { db } from '@/lib/firebase'
import { UserData } from '@/types/firestore-data'
import { useEffect, useState } from 'react'

const Setting = () => {
  const [userData, setUserData] = useState<UserData>()
  const [usersShow, setUsersShow] = useState(false)
  const [jobsShow, setJobsShow] = useState(false)

  const toggleUsersShow = () => setUsersShow(!usersShow)

  const toggleJobsShow = () => setJobsShow(!jobsShow)

  useEffect(() => {
    getUserData()
  }, [])

  const getUserData = async () => {
    const userDocRef = doc(db, 'users', '6376611308')
    const docSnapshot = await getDoc(userDocRef)

    if (!docSnapshot.exists()) {
      throw new Error('Документ не найден')
    }

    setUserData(docSnapshot.data() as UserData)
  }

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        <div className={styles.content}>
          <button className={`${styles.menu_button} ${styles.setting_button}`}>
            Имя <span>{userData?.user_name ?? ''}</span>
          </button>
          <button className={`${styles.menu_button} ${styles.setting_button}`}>
            Цвет{' '}
            <div className={styles.color_container}>
              <div
                style={{
                  background: userData?.user_color,
                }}
                className={styles.color_inside_container}
              ></div>
            </div>
          </button>
          <button className={`${styles.menu_button} ${styles.setting_button}`}>
            Запросы
          </button>

          <div className={styles.dropdown}>
            <button
              onClick={toggleUsersShow}
              className={`${styles.menu_button} ${styles.setting_button}`}
            >
              Сотрудники
            </button>
            <div
              style={{
                maxHeight: `${usersShow ? 44 * 4 + 10 : 0}px`,
                marginBottom: `${usersShow ? 4 : 0}px`,
              }}
              className={`${styles.dropdownContent} ${
                usersShow ? styles.open : ''
              }`}
            >
              <div className={styles.user_item}>Никита</div>
              <div className={styles.user_item}>Дима</div>
              <div className={styles.user_item}>Иван</div>
              <div className={styles.user_item}>Даниил</div>
            </div>
          </div>
          <div className={styles.dropdown}>
            <button
              onClick={toggleJobsShow}
              className={`${styles.menu_button} ${styles.setting_button}`}
            >
              Магазины
            </button>
            <div
              style={{
                maxHeight: `${jobsShow ? 44 * 9 + 10 : 0}px`,
                marginBottom: `${jobsShow ? 4 : 0}px`,
              }}
              className={`${styles.dropdownContent} ${
                jobsShow ? styles.open : ''
              }`}
            >
              <div className={styles.user_item}>М7</div>
              <div className={styles.user_item}>Экстрим</div>
              <div className={styles.user_item}>Климовск</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Setting
