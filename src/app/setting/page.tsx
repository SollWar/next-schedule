'use client'
import styles from './page.module.css'

const Setting = () => {
  //const router = useRouter()

  // const popUp = () => {
  //   router.back()
  // }

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.content}>
          <button className={`${styles.menu_button} ${styles.setting_button}`}>
            ID Пользователя
          </button>
          <button className={`${styles.menu_button} ${styles.setting_button}`}>
            Имя пользователя
          </button>
          <button className={`${styles.menu_button} ${styles.setting_button}`}>
            Цвет пользователя
          </button>
          <button className={`${styles.menu_button} ${styles.setting_button}`}>
            Список магазинов
          </button>
        </div>
      </div>
    </div>
  )
}

export default Setting
