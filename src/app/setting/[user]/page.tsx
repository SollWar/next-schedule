'use client'
import { db } from '@/lib/firebase'
import { UserData } from '@/types/firestore-data'
import { doc, getDoc } from 'firebase/firestore'
import { use, useEffect, useState } from 'react'
import styles from './page.module.css'
import ModalColorPicker from '@/components/Modal/ModalColorPicker/ModalColorPicker'
import Modal from 'react-modal'
import { setUserColor, setUserName } from '@/server/schedule_update/actions'

Modal.setAppElement('body')

const User = ({ params }: { params: Promise<{ user: string }> }) => {
  const [newName, setNewUserName] = useState<string>('')
  const [userData, setUserData] = useState<UserData>()
  const [colorModalOpen, setCorolModalOpen] = useState(false)
  const { user } = use(params)

  const openColorModal = () => {
    setCorolModalOpen(true)
  }
  const colorCloseModal = () => {
    setCorolModalOpen(false)
  }

  const selectColor = async (color: string) => {
    console.log(color)
    await setUserColor(userData?.id as string, color)
    getUserData(user)
    setCorolModalOpen(false)
  }

  const changeName = async (newName: string) => {
    console.log(newName)
    await setUserName(userData?.id as string, newName)
    getUserData(user)
  }

  useEffect(() => {
    getUserData(user)
  }, [])
  const getUserData = async (user: string) => {
    const jobRef = doc(db, 'users', user)
    const docSnapshot = await getDoc(jobRef)
    const userData = {
      ...(docSnapshot.data() as UserData),
      id: docSnapshot.id,
    }

    setUserData(userData)
  }

  if (!userData) {
    return <div className={styles.loader}></div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        <div className={styles.content}>
          <input
            className={`${styles.menu_button} ${styles.setting_button}`}
            type="text"
            onChange={(e) => setNewUserName(e.target.value)}
            value={newName}
            placeholder={userData?.id}
            onSubmit={() => {}}
          />
          <input
            className={`${styles.menu_button} ${styles.setting_button}`}
            type="text"
            onChange={(e) => setNewUserName(e.target.value)}
            value={newName}
            placeholder={userData?.user_name}
            onSubmit={() => {
              changeName(newName)
            }}
          />
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
        </div>
      </div>
      <ModalColorPicker
        colorModalOpen={colorModalOpen}
        colorCloseModal={colorCloseModal}
        userName={userData?.user_name as string}
        selectColor={selectColor}
        initColor={userData?.user_color as string}
      />
    </div>
  )
}

export default User
