'use client'
import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import styles from './ModalSetUserName.module.css'

interface ModalSetUserNameProps {
  nameModalOpen: boolean
  nameCloseModal: () => void
  setNewName: (name: string) => void
  initName: string
}

const ModalSetUserName = ({
  nameModalOpen,
  nameCloseModal,
  initName,
  setNewName,
}: ModalSetUserNameProps) => {
  const [name, setName] = useState(initName)
  const [update, setUpdate] = useState(false)

  useEffect(() => {
    setUpdate(false)
  }, [initName])

  return (
    <Modal
      isOpen={nameModalOpen}
      onRequestClose={nameCloseModal}
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
          <div
            style={{
              textAlign: 'center',
            }}
          >
            Имя пользователя
          </div>
          <div
            style={{
              display: 'flex',
            }}
          >
            <input
              style={{
                width: '100%',
                display: 'flex',
                margin: '16px 2px',
                fontSize: '22px',
              }}
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              onSubmit={() => {
                if (name != initName) {
                  setNewName(name)
                  setUpdate(true)
                }
              }}
            />
          </div>
          <div className={styles.editable_container}>
            <button
              onClick={nameCloseModal}
              disabled={update}
              style={{
                padding: '6px',
                color: update ? 'rgba(255, 255, 255, 0.2)' : 'white',
                cursor: update ? 'default' : 'pointer',
              }}
              className={styles.menu_button}
            >
              Отмена
            </button>
            <button
              onClick={() => {
                if (name != initName) {
                  setNewName(name)
                  setUpdate(true)
                }
              }}
              disabled={update}
              style={{
                padding: '6px',
                cursor: update ? 'default' : 'pointer',
              }}
              className={styles.menu_button}
            >
              {update ? <div className={styles.loader}></div> : <>Сохранить</>}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ModalSetUserName
