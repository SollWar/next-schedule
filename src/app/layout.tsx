import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import Header from '../components/Header/Header'
import './globals.css'
import { Suspense } from 'react'

const roboto = Roboto({
  subsets: ['latin', 'cyrillic'], // Укажите поддерживаемые символы (latin, cyrillic и т. д.)
  weight: ['400', '700'], // Укажите нужные веса
  display: 'swap', // Улучшает рендеринг шрифтов
})

export const metadata: Metadata = {
  title: 'График',
  description: 'Рабочий график',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Suspense>
          <Header />
          {children}
        </Suspense>
      </body>
    </html>
  )
}
