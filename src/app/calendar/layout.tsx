'use client'

import ResponsiveLayout from '@/components/ResponsiveLayout/ResponsiveLayout'
//import userAuth from '@/hooks/useUserAuth'
import { Roboto } from 'next/font/google'
import React from 'react'

const roboto = Roboto({
  subsets: ['latin', 'cyrillic'], // Укажите поддерживаемые символы (latin, cyrillic и т. д.)
  weight: ['400', '700'], // Укажите нужные веса
  display: 'swap', // Улучшает рендеринг шрифтов
})

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={roboto.className} style={{ backgroundColor: '#f0f0f0' }}>
      <ResponsiveLayout>{children}</ResponsiveLayout>
    </div>
  )
}
