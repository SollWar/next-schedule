export interface TelegramUser {
  id: number
  first_name: string
  last_name: string
  username: string
  language_code: string
  allows_write_to_pm: boolean
  photo_url?: string
}

export interface InitData {
  user: TelegramUser
  auth_date: number
  hash: string
  chat_type: string
  [key: string]: string | number | TelegramUser
}
