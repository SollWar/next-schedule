'use client'
import { useEffect, useState } from 'react'

export default function useTelegramScript() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [initData, setInitData] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return // Важно для SSR

    const loadScript = () => {
      if (window.Telegram?.WebApp) {
        setIsLoaded(true)
        setInitData(window.Telegram.WebApp.initData)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://telegram.org/js/telegram-web-app.js?56'
      script.async = true

      script.onload = () => {
        window.Telegram?.WebApp.ready()
        setIsLoaded(true)
        setInitData(window.Telegram?.WebApp.initData || null)
      }

      script.onerror = () => {
        console.error('Failed to load Telegram script')
      }

      document.head.appendChild(script)
    }

    loadScript()
  }, [])

  return {
    isLoaded,
    initData,
  }
}
