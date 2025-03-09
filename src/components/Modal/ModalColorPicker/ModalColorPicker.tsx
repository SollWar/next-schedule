'use client'
import { getContrastTextColor } from '@/utils/colorsUtils'
import { useEffect, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import Modal from 'react-modal'
import styles from './ModalColorPicker.module.css'

interface ModalColorPickerProps {
  colorModalOpen: boolean
  colorCloseModal: () => void
  selectColor: (color: string) => void
  userName: string
  initColor: string
}

const ModalColorPicker = ({
  colorModalOpen,
  colorCloseModal: closeModal,
  userName,
  selectColor,
  initColor,
}: ModalColorPickerProps) => {
  const [color, setColor] = useState(initColor)
  const [update, setUpdate] = useState(false)

  useEffect(() => {
    setUpdate(false)
  }, [initColor])

  return (
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
              {userName}
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
          <div className={styles.editable_container}>
            <button
              onClick={closeModal}
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
                if (color != initColor) {
                  selectColor(color)
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

export default ModalColorPicker
