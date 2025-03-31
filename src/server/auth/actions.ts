'use server'
import admin from 'firebase-admin'
import { createHmac } from 'node:crypto'

// Инициализация firebase-admin, если ещё не инициализирована
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

export async function getCustomTokenAction(initData: string): Promise<string> {
  // Проверка наличия initData
  if (!initData) {
    throw new Error('initData is required')
  }

  // Разбор initData
  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  params.delete('hash')
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n')

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) {
    throw new Error('BOT_TOKEN is not defined in .env')
  }

  const secret = createHmac('sha256', 'WebAppData').update(botToken).digest()
  const calculatedHash = createHmac('sha256', secret)
    .update(dataCheckString)
    .digest('hex')

  if (hash !== calculatedHash) {
    throw new Error('Invalid initData')
  }

  // Получаем telegramID из параметров (парсинг user, как в вашем API-роуте)
  const userString = params.get('user')
  if (!userString) {
    throw new Error('User data missing')
  }
  const user = JSON.parse(decodeURIComponent(userString))
  const telegramID = user.id

  if (!telegramID) {
    throw new Error('telegramID is missing')
  }

  // Проверяем наличие пользователя в Firestore
  const db = admin.firestore()
  const userDoc = await db.collection('users').doc(telegramID.toString()).get()
  if (!userDoc.exists) {
    throw new Error('User not found')
  }

  // Генерируем customToken через firebase-admin
  const customToken = await admin
    .auth()
    .createCustomToken(telegramID.toString())
  return customToken
}
