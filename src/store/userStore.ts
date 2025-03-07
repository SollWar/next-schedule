import { create } from 'zustand'
import { db } from '../lib/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { UserData } from '@/types/firestore-data'

interface DocumentStoreState {
  userData: UserData | null // Данные документа
  uid: string | null
  loading: boolean // Состояние загрузки
  error: string | null // Ошибка, если есть
  isInitialized: boolean
  subscribeToUser: (uid: string) => void // Функция для подписки
}

const userStore = create<DocumentStoreState>((set) => ({
  userData: null, // Данные документа
  uid: null,
  loading: true, // Состояние загрузки
  error: null, // Ошибка, если есть
  isInitialized: false,

  // Функция для подписки на обновления документа
  subscribeToUser: (uid) => {
    const documentRef = doc(db, `users/${uid}`)
    // Подписка на обновления документа
    const unsubscribe = onSnapshot(
      documentRef,
      (snapshot) => {
        if (snapshot.exists()) {
          // Если документ существует, обновляем состояние
          set({
            userData: snapshot.data() as UserData,
            uid: uid,
            loading: false,
            error: null,
            isInitialized: true,
          })
        } else {
          // Если документ не существует
          set({
            userData: null,
            uid: null,
            loading: false,
            error: 'Document does not exist',
            isInitialized: false,
          })
        }
      },
      (error) => {
        // Если произошла ошибка
        set({ error: error.message, loading: false })
      }
    )
    // Возвращаем функцию для отписки
    return unsubscribe
  },
}))

export default userStore
