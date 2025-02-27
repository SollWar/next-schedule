import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'График',
  description: 'Рабочий график',
}

export default function CalendarLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <Suspense>{children}</Suspense>
}
