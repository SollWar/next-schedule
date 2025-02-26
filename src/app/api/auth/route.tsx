import { InitData } from '@/types/telegram-data'
import { NextResponse } from 'next/server'
import { createHmac } from 'node:crypto'
import admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_ADMIN_DATABASE_URL,
  })
}

// POST на валидацию телеграм
export async function POST(request: Request) {
  try {
    //TODO(УБРАТЬ)
    ////////

    let customToken:
      | string
      | NextResponse<{
          error: string
        }> = await firebaseAuth(6376611308)

    return NextResponse.json({ customToken })

    ////////
    /*
    let customToken:
      | string
      | NextResponse<{
          error: string
        }> = ''

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

    const telegramID = jsonInitData.user.id

    // Получите токен бота из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      throw new Error('BOT_TOKEN is not defined in .env')
    }
    // Проверка валидности данных
    const isValid = manualValidate(initData, botToken)

    if (isValid) {
      customToken = await firebaseAuth(telegramID)
    }

    return NextResponse.json({ customToken })
    */
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

async function firebaseAuth(telegramID: number) {
  console.log(telegramID)

  // Если UID не получен
  if (!telegramID) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  /// Тут выполняется логика для провеки разрешения на авторизацию
  // Конкретно тут проверяется полученный id (Как-бы телеграм ид)
  const db = admin.firestore()
  const userDoc = await db.collection('users').doc(telegramID.toString()).get()

  // Если его нету то разворачиваем попытку
  if (await !userDoc.exists) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // И если он есть в базе, то генерируем кастомный токен на основании полученного токена
  const customToken = await admin
    .auth()
    .createCustomToken(telegramID.toString())

  // И возвращаем токен клиенту
  return customToken
}
