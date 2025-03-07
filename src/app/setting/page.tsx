'use client'
import styles from './page.module.css'
import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { getContrastTextColor } from '@/utils/colorsUtils'
import { HexColorPicker } from 'react-colorful'
import { setUserColor } from '@/server/schedule_update/actions'
import userStore from '@/store/userStore'

Modal.setAppElement('body')

const Setting = () => {
  const [color, setColor] = useState('#aabbcc')
  const [usersShow, setUsersShow] = useState(false)
  const [jobsShow, setJobsShow] = useState(false)
  const [colorModalOpen, setCorolModalOpen] = useState(false)
  const { userData, uid, loading } = userStore()

  const openModal = () => {
    setColor(userData?.user_color as string)
    setCorolModalOpen(true)
  }

  const closeModal = () => {
    setCorolModalOpen(false)
  }

  const selectColor = async () => {
    await setUserColor(uid as string, color)
    setCorolModalOpen(false)
  }

  const toggleUsersShow = () => setUsersShow(!usersShow)

  const toggleJobsShow = () => setJobsShow(!jobsShow)

  if (loading) {
    return <div className={styles.loader}></div>
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
        isOpen={colorModalOpen}
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
                  marginRight: '8px',
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '16px',
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  padding: '6px',
                }}
                className={styles.menu_button}
              >
                Отмена
              </button>
              <button
                onClick={selectColor}
                style={{
                  padding: '6px',
                }}
                className={styles.menu_button}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Setting
