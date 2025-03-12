'use client'
import styles from './page.module.css'
import { useState } from 'react'
import Modal from 'react-modal'
import { setUserColor, setUserName } from '@/server/schedule_update/actions'
import userStore from '@/store/userStore'
import ModalColorPicker from '@/components/Modal/ModalColorPicker/ModalColorPicker'
import ModalSetUserName from '@/components/Modal/ModalSetUserName/ModalSetUserName'
import useAllUsers from '@/hooks/useAllUsers'
import useAllJobs from '@/hooks/useAllJobs'
import { useRouter } from 'next/navigation'

Modal.setAppElement('body')

const Setting = () => {
  const [usersShow, setUsersShow] = useState(false)
  const [jobsShow, setJobsShow] = useState(false)
  const [colorModalOpen, setCorolModalOpen] = useState(false)
  const [nameModalOpen, setNameModalOpen] = useState(false)
  const { users } = useAllUsers()
  const { jobs } = useAllJobs()
  const { userData, uid, loading } = userStore()
  const router = useRouter()

  const openColorModal = () => {
    setCorolModalOpen(true)
  }

  const openNameModal = () => {
    setNameModalOpen(true)
  }

  const colorCloseModal = () => {
    setCorolModalOpen(false)
  }

  const nameCloseModal = () => {
    setNameModalOpen(false)
  }

  const selectColor = async (color: string) => {
    await setUserColor(uid as string, color)
    setCorolModalOpen(false)
  }

  const setNewName = async (name: string) => {
    await setUserName(uid as string, name)
    setNameModalOpen(false)
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
          <button
            onClick={openNameModal}
            className={`${styles.menu_button} ${styles.setting_button}`}
          >
            Имя <span>{userData?.user_name ?? ''}</span>
          </button>
          <button
            onClick={openColorModal}
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
          {userData?.permissions.indexOf('admin') != -1 ? (
            <>
              <button
                className={`${styles.menu_button} ${styles.setting_button}`}
              >
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
                    maxHeight: `${
                      usersShow ? 44 * ((users?.length as number) + 1) + 10 : 0
                    }px`,
                    marginBottom: `${usersShow ? 4 : 0}px`,
                  }}
                  className={`${styles.dropdownContent} ${
                    usersShow ? styles.open : ''
                  }`}
                >
                  {users?.map((user) => (
                    <button
                      onClick={() => {
                        router.push(`/setting/${user.id}`)
                      }}
                      key={user.user_name}
                      className={styles.user_item}
                    >
                      {user.user_name}
                    </button>
                  ))}
                  <button
                    style={{
                      justifyContent: 'flex-end',
                      background: 'white',
                      border: '#0070f3 solid 1px',
                      color: '#0070f3',
                    }}
                    className={styles.user_item}
                  >
                    Создать
                  </button>
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
                      jobsShow ? 44 * ((jobs?.length as number) + 1) + 10 : 0
                    }px`,
                    marginBottom: `${jobsShow ? 4 : 0}px`,
                  }}
                  className={`${styles.dropdownContent} ${
                    jobsShow ? styles.open : ''
                  }`}
                >
                  {jobs?.map((job) => (
                    <button key={job.job_name} className={styles.user_item}>
                      {job.job_name}
                    </button>
                  ))}
                  <button
                    style={{
                      justifyContent: 'flex-end',
                      background: 'white',
                      border: '#0070f3 solid 1px',
                      color: '#0070f3',
                    }}
                    className={styles.user_item}
                  >
                    Создать
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <ModalColorPicker
        colorModalOpen={colorModalOpen}
        colorCloseModal={colorCloseModal}
        userName={userData?.user_name as string}
        selectColor={selectColor}
        initColor={userData?.user_color as string}
      />
      <ModalSetUserName
        nameModalOpen={nameModalOpen}
        nameCloseModal={nameCloseModal}
        initName={userData?.user_name as string}
        setNewName={setNewName}
      />
    </div>
  )
}

export default Setting
