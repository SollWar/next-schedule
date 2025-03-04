'use client'
import { doc, getDoc } from 'firebase/firestore'
import styles from './page.module.css'
import { auth, db } from '@/lib/firebase'
import { UserData } from '@/types/firestore-data'
import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { getContrastTextColor } from '@/utils/colorsUtils'
import { User } from 'firebase/auth'
import useUserAuth from '@/hooks/useUserAuth'
import { HexColorPicker } from 'react-colorful'

Modal.setAppElement('body')

const Setting = () => {
  const [userData, setUserData] = useState<UserData>()
  const [color, setColor] = useState('#aabbcc')
  const [usersShow, setUsersShow] = useState(false)
  const [jobsShow, setJobsShow] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const { user, loading } = useUserAuth()

  const colors: string[] = [
    '#1B1F3B',
    '#3B1F1B',
    '#1B3B1F',
    '#3B3B1B',
    '#1B3B3B',
    '#3B1B3B',
    '#002B5B',
    '#5B002B',
    '#005B2B',
    '#2B5B00',
    '#5B5B00',
    '#5B2B00',
    '#2B005B',
    '#400040',
    '#004040',
    '#402000',
    '#200040',
    '#004020',
    '#402040',
    '#0A0A0A',
    '#E6F7FF',
    '#FFE6F7',
    '#F7FFE6',
    '#FFF7E6',
    '#E6FFF7',
    '#F7E6FF',
    '#D0EBFF',
    '#FFD0EB',
    '#EBFFD0',
    '#FFF0D0',
    '#D0FFF0',
    '#F0D0FF',
    '#FFF0F0',
    '#F0FFF0',
    '#F0F0FF',
    '#FFFFD0',
    '#D0FFFF',
    '#FFD0D0',
    '#E0E0FF',
    '#FFF8E0',
  ]

  const openModal = () => {
    setColor(userData?.user_color as string)
    setModalOpen(true)
  }

  const closeModal = () => {
    console.log(color != '' ? color : 'not selected color')
    setModalOpen(false)
  }

  const toggleUsersShow = () => setUsersShow(!usersShow)

  const toggleJobsShow = () => setJobsShow(!jobsShow)

  useEffect(() => {
    if (user) {
      getUserData(user?.uid as string)
    }
  }, [user])

  const getUserData = async (userId: string) => {
    const userDocRef = doc(db, 'users', userId)
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
          <button
            onClick={openModal}
            className={`${styles.menu_button} ${styles.setting_button}`}
          >
            Цвет
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
                maxHeight: `${
                  jobsShow ? 44 * (userData?.jobs.length as number) + 10 : 0
                }px`,
                marginBottom: `${jobsShow ? 4 : 0}px`,
              }}
              className={`${styles.dropdownContent} ${
                jobsShow ? styles.open : ''
              }`}
            >
              {userData?.jobs.map((job) => (
                <div key={job} className={styles.user_item}>
                  {job}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Пример модального окна"
        style={{
          content: {
            width: '80vw', // Ширина модального окна
            height: 'fit-content', // Высота модального окна
            margin: 'auto', // Центрирование по горизонтали
            borderRadius: '10px', // Закругленные углы
            padding: '0px',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Прозрачность фона
          },
        }}
      >
        <div
          style={{
            padding: '16px',
          }}
        >
          <div>
            <HexColorPicker
              style={{
                width: 'auto',
              }}
              color={color}
              onChange={setColor}
            />
            <div
              style={{
                display: 'flex',
                marginTop: '16px',
              }}
            >
              <span
                style={{
                  width: '-webkit-fill-available',
                  padding: '8px',
                  borderRadius: '10px',
                  color: getContrastTextColor(color),
                  backgroundColor: color,
                  textAlign: 'center',
                }}
              >
                {userData?.user_name}
              </span>
              <span
                style={{
                  padding: '8px',
                  borderRadius: '10px',
                  color: getContrastTextColor(color),
                  backgroundColor: color,
                  textAlign: 'center',
                }}
              >
                27
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Setting
