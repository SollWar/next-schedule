import { initializeApp, cert, App, ServiceAccount } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
require('dotenv').config()

// Тип для сервисного аккаунта Firebase
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID as string,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL as string,
  privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY as string).replace(
    /\\n/g,
    '\n'
  ),
}

// Инициализация Firebase Admin SDK
const app: App = initializeApp({
  credential: cert(serviceAccount),
})

// Получение экземпляра Firestore
const db: Firestore = getFirestore(app)

export { db }
