import { NextResponse } from 'next/server'
import admin from 'firebase-admin'

// Инициализация Firebase Admin
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

// POST на получение токена
export async function POST(request: Request) {
  try {
    // Получаем UID из запроса
    const { telegramID } = await request.json()

    // Если UID не получен
    if (!telegramID) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    /// Тут выполняется логика для провеки разрешения на авторизацию
    // Конкретно тут проверяется полученный id (Как-бы телеграм ид)
    const db = admin.firestore()
    const userDoc = await db
      .collection('users')
      .doc(telegramID.toString())
      .get()

    // Если его нету то разворачиваем попытку
    if (await !userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // И если он есть в базе, то генерируем кастомный токен на основании полученного токена
    const customToken = await admin
      .auth()
      .createCustomToken(telegramID.toString())

    // И возвращаем токен клиенту
    return NextResponse.json({ customToken })
  } catch (error) {
    console.error('Error creating custom token:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
