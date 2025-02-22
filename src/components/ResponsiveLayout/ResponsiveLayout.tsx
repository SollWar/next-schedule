'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './ResponsiveLayout.module.css'
import Link from 'next/link'

export default function ResponsiveLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loding, setLoading] = useState(false)
  const router = useRouter()

  const toggleMenu = () => setMenuOpen((prev) => !prev)
  const closeMenu = () => setMenuOpen(false)

  // Обработчик клика для перехода по ссылке с плавным закрытием меню и заменой истории навигации
  const handleLinkClick =
    (target: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      router.replace(target)
      closeMenu()
    }

  return (
    <div className={styles.container}>
      {/* Боковое меню */}
      <aside
        className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}
      >
        <div className={styles.menuContent}>
          <h2>Меню</h2>
          <div>
            <a onClick={handleLinkClick('/main/setting')}>Настройки</a>
          </div>
          <div>
            <a onClick={handleLinkClick('/main/calendar')}>Календарь</a>
          </div>
          <div>
            <a onClick={handleLinkClick('/main/other')}>Пункт 3</a>
          </div>
        </div>
      </aside>

      {/* Оверлей для затемнения фона (закрывает меню при клике вне его) */}
      {menuOpen && <div className={styles.overlay} onClick={closeMenu} />}

      {/* Основной контент */}
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <button className={styles.menuButton} onClick={toggleMenu}>
            Меню
          </button>
        </header>
        <div className={styles.content}> {loding ? 'Loading' : children} </div>
      </div>
    </div>
  )
}
