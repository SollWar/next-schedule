import { InitData } from '@/types/telegram-data'
import { NextResponse } from 'next/server'
import { createHmac } from 'node:crypto'

// POST на валидацию телеграм
export async function POST(request: Request) {
  try {
    // Получение initData из запроса
    const { initData } = await request.json()

    // Проверка есть ли initData в запросе
    if (!initData) {
      return NextResponse.json(
        { error: 'initData is required' },
        { status: 400 }
      )
    }

    // Получение полей initData
    const jsonInitData = parseInitData(initData)

    console.log('Telegram ID:', jsonInitData.user.id)
    const telegramID = jsonInitData.user.id

    // Получите токен бота из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      throw new Error('BOT_TOKEN is not defined in .env')
    }
    // Проверка валидности данных
    const isValid = manualValidate(initData, botToken)

    if (isValid) {
      return NextResponse.json({ telegramID })
    }

    return NextResponse.json({})
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Validation failed' },
      { status: 500 }
    )
  }
}

function manualValidate(initData: string, botToken: string) {
  // Параметры Web App
  const params = new URLSearchParams(initData)
  // Удаление поля hash
  const hash = params.get('hash')
  params.delete('hash')

  // Обработка параметров
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n')

  // Получение ключа на основе токена бота
  const secret = createHmac('sha256', 'WebAppData').update(botToken).digest()

  // Получение второго ключа
  const calculatedHash = createHmac('sha256', secret)
    .update(dataCheckString)
    .digest('hex')

  // Сравнение полученных ключей
  return hash === calculatedHash
}

// Функция для разбора полученной строки
function parseInitData(queryString: string): InitData {
  const params = new URLSearchParams(queryString)

  // Парсинг пользователя
  const user = JSON.parse(decodeURIComponent(params.get('user') || '{}'))

  // Основные поля
  const result: InitData = {
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      language_code: user.language_code,
      allows_write_to_pm: user.allows_write_to_pm,
      photo_url: user.photo_url,
    },
    auth_date: Number(params.get('auth_date')),
    hash: params.get('hash') || '',
    chat_type: params.get('chat_type') || '',
  }

  // Добавляем дополнительные параметры
  params.forEach((value, key) => {
    if (!['user', 'auth_date', 'hash', 'chat_type'].includes(key)) {
      result[key] = value
    }
  })

  return result
}
