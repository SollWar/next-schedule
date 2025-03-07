import { db } from '@/lib/firebase'
import { JobData, UserData } from '@/types/firestore-data'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  Unsubscribe,
} from 'firebase/firestore'
import { create } from 'zustand'

interface ScheduleStoreState {
  userData: UserData | UserData[] | null
  jobData: JobData | JobData[] | null
  loading: boolean
  error: string | null
  unsubscribeUser: Unsubscribe | null // Функция отписки для пользователя
  unsubscribeJob: Unsubscribe | null // Функция отписки для работы
  subscribeToUser: (id: string) => void
  subscribeToJob: (id: string) => void
}

const scheduleStore = create<ScheduleStoreState>((set, get) => ({
  userData: null,
  jobData: null,
  loading: true,
  error: null,
  unsubscribeUser: null,
  unsubscribeJob: null,

  subscribeToJob: async (id) => {
    const state = get()

    // Отписываемся от предыдущих подписок
    if (state.unsubscribeJob) state.unsubscribeJob()
    if (state.unsubscribeUser) state.unsubscribeUser()

    set({ loading: true, error: null })

    try {
      const jobRef = doc(db, 'jobs', id)
      const docSnapshot = await getDoc(jobRef)

      if (!docSnapshot.exists()) {
        set({ error: 'Job not found', loading: false })
        return
      }

      const jobDataDoc = (await docSnapshot.data()) as JobData
      const usersQuery = query(
        collection(db, 'users'),
        where('__name__', 'in', jobDataDoc.users)
      )

      // Сохраняем функцию отписки
      const unsubscribe = onSnapshot(usersQuery, async (snapshot) => {
        set({ loading: true })

        const usersData = await snapshot.docs.map((doc) => ({
          ...(doc.data() as UserData),
          id: doc.id,
        }))

        set({
          userData: usersData,
          jobData: jobDataDoc,
          loading: false,
          error: null,
        })
      })
      set({ unsubscribeJob: unsubscribe })
    } catch (error) {
      console.warn(error)
      set({ error: 'Error fetching job', loading: false })
    }
  },

  subscribeToUser: async (id) => {
    const state = get()

    set({ loading: true })
    // Отписываемся от предыдущих подписок
    if (state.unsubscribeUser) state.unsubscribeUser()
    if (state.unsubscribeJob) state.unsubscribeJob()

    try {
      const userRef = doc(db, 'users', id)

      // Сохраняем функцию отписки
      const unsubscribe = onSnapshot(userRef, async (snapshot) => {
        set({ loading: true })

        if (snapshot.exists()) {
          const userDataSnap = (await snapshot.data()) as UserData
          const q = query(
            collection(db, 'jobs'),
            where('users', 'array-contains', id)
          )

          const querySnapshot = await getDocs(q)
          const userJobsDoc = querySnapshot.docs.map(
            (doc) => doc.data() as JobData
          )

          set({
            userData: userDataSnap,
            jobData: userJobsDoc,
            loading: false,
            error: null,
          })
        } else {
          set({ error: 'User not found', loading: false })
        }
      })

      set({ unsubscribeUser: unsubscribe })
    } catch (error) {
      console.warn(error)
      set({ error: 'Error fetching user', loading: false })
    }
  },
}))

export default scheduleStore
