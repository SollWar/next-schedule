import { NextResponse } from 'next/server'
import admin from 'firebase-admin'
import { UserData } from '@/types/firestore-data'
import { WriteResult } from 'firebase-admin/firestore'

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

export async function POST(request: Request) {
  try {
    const { newSchedule, type, id, year, month, usersId }: QueryProps =
      await request.json()
    const db = admin.firestore()

    if (type == 'user') {
      const scheduleRef = db.collection('users').doc(id)
      const refToUpdate = `schedule.${year}.${month}`

      await scheduleRef.update({
        [refToUpdate]: newSchedule.join(','),
      })

      console.log('Field updated successfully')
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
        id: doc.id,
        ...(doc.data() as UserData),
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

      const forUpdate: Promise<WriteResult>[] = []

      scheduleForUsers.forEach(async (schedule, index) => {
        const scheduleRef = db.collection('users').doc(usersId[index])
        const refToUpdate = `schedule.${year}.${month}`
        forUpdate.push(
          scheduleRef.update({
            [refToUpdate]: (schedule as string[]).join(','),
          })
        )
      })

      await Promise.all(forUpdate)
    }
    return NextResponse.json({})
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Error updating field',
      },
      { status: 500 }
    )
  }
}
