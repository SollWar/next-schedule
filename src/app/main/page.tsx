'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Main = () => {
  const navigate = useRouter()

  useEffect(() => {
    navigate.replace('/main/calendar')
  }, [])

  return (
    <div>
      <h1>Добро пожаловать на страницу Main!</h1>
      <p>
        Это содержимое страницы, которое адаптируется в зависимости от
        устройства.
      </p>
    </div>
  )
}

export default Main
