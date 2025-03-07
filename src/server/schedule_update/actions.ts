'use server'
import admin from 'firebase-admin'
import { UserData } from '@/types/firestore-data'
import { getDaysInMonth, MONTH } from '@/utils/dateUtils'

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

interface QueryProps {
  newSchedule: string[]
  type: string
  id: string
  year: string
  month: string
  usersId: string[]
}

export async function setNewSchedule({
  newSchedule,
  type,
  id,
  year,
  month,
  usersId,
}: QueryProps) {
  try {
    const db = admin.firestore()

    if (type == 'user') {
      const scheduleRef = db.collection('users').doc(id)
      const refToUpdate = `schedule.${year}.${month}`

      scheduleRef.update({
        [refToUpdate]: newSchedule.join(','),
      })
    } else if (type == 'job') {
      const clearUserIds = usersId.filter((str) => str !== 'error')

      const usersRef = db.collection('users')
      const usersQuery = usersRef.where(
        admin.firestore.FieldPath.documentId(),
        'in',
        clearUserIds
      )

      // Выполняем запрос
      const querySnapshot = await usersQuery.get()

      // Преобразуем результат в массив объектов
      const usersData = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as UserData),
        id: doc.id,
      }))

      const scheduleForUsers = clearUserIds.map(() =>
        new Array(newSchedule.length).fill('0')
      )

      const currentUserSchedule: string[][] = usersData.map((user) =>
        user.schedule[year][month].split(',')
      )

      // Кажись теперь работает правильно
      newSchedule.forEach((assignedUser, dayIndex) => {
        clearUserIds.forEach((userId, userIndex) => {
          if (assignedUser === userId) {
            // Если по новому расписанию этот пользователь должен работать в этот день,
            // назначаем в расписании магазина значение id.
            scheduleForUsers[userIndex][dayIndex] = id
          } else if (assignedUser === 'error') {
            scheduleForUsers[userIndex][dayIndex] =
              currentUserSchedule[userIndex][dayIndex]
          } else {
            // Если в личном расписании пользователя был назначен магазин (id),
            // а новый график его не назначает, то ставим выходной ('0').
            if (currentUserSchedule[userIndex][dayIndex] === id) {
              scheduleForUsers[userIndex][dayIndex] = '0'
            } else {
              // Иначе оставляем текущее значение из личного расписания.
              scheduleForUsers[userIndex][dayIndex] =
                currentUserSchedule[userIndex][dayIndex]
            }
          }
        })
      })

      const batch = db.batch()

      scheduleForUsers.forEach(async (schedule, index) => {
        const refToBatch = db.collection('users').doc(usersId[index])
        const updateString = `schedule.${year}.${month}`

        batch.update(refToBatch, {
          [updateString]: (schedule as string[]).join(','),
        })
      })

      await batch.commit()
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

export const generateSchedule = async (
  id: string,
  year: string,
  month: string
) => {
  const emptySchedule: string[] = new Array(
    getDaysInMonth(Number.parseInt(year), MONTH.indexOf(month))
  ).fill('0')

  const db = admin.firestore()
  const scheduleRef = db.collection('users').doc(id)
  const refToUpdate = `schedule.${year}.${month}`

  await scheduleRef.update({
    [refToUpdate]: emptySchedule.join(','),
  })

  return emptySchedule
}

export const setUserColor = async (userId: string, newColor: string) => {
  try {
    const db = admin.firestore()
    const scheduleRef = db.collection('users').doc(userId)
    await scheduleRef.update({
      user_color: newColor,
    })
    return true
  } finally {
    return false
  }
}

export const setUserName = async (userId: string, newName: string) => {
  try {
    const db = admin.firestore()
    const scheduleRef = db.collection('users').doc(userId)
    await scheduleRef.update({
      user_name: newName,
    })
    return true
  } finally {
    return false
  }
}
