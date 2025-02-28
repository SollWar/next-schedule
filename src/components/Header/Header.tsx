'use client'
import { usePathname } from 'next/navigation'
import CalendarPageHeader from './CalendarPageHeader'
import SettingPageHeader from './SettingPageHeader'

interface HeaderProps {
  onNewQueryClicl: (query: string) => void
  currentScheduleName: string
  children: React.ReactNode
}

const Header = () => {
  const pathname = usePathname()
  const isSettingsPage = pathname.startsWith('/setting')
  const isCalendarPage = pathname.startsWith('/calendar')
  const isMainPage = pathname.endsWith('/')

  if (isMainPage) return <></>
  else if (isSettingsPage) return <SettingPageHeader />
  else if (isCalendarPage) return <CalendarPageHeader />
}

export default Header
