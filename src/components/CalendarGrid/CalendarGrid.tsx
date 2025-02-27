'use client'
import { getFirstWeekdayOfMonth } from '@/utils/dateUtils'
import styles from './CalendarGrid.module.css'
import { getContrastTextColor } from '@/utils/colorsUtils'
import { useEffect, useState } from 'react'
import DropDown from '../DropDown/DropDown'
//import { useState } from 'react'

interface CalendarGridProps {
  schedule: string[]
  entityIds: string[]
  entityNames: string[]
  entityColors: string[]
  onAcceptClick: (newSchedule: string[]) => void
}

const CalendarGrid = ({
  schedule,
  entityIds,
  entityNames,
  entityColors,
  onAcceptClick,
}: CalendarGridProps) => {
  const [show, setShow] = useState(false)
  const [editable, setEditable] = useState(false)
  const [tempSchedule, setTempSchedule] = useState(schedule)
  const [jobCounts, setJobCounts] = useState<number[]>([])
  const [dropDownItems, setDropDownItems] = useState<string[]>([''])

  const firstWeekdayOfMonth = getFirstWeekdayOfMonth(2025, 1)
  const fakeDays = new Array(firstWeekdayOfMonth - 1).fill(0)

  const calculateJobCount = (schedule: string[]) => {
    const jobCount = new Array(schedule.length).fill(0)
    schedule.map((day) => {
      entityIds.map((job, index) => {
        if (day == job) {
          jobCount[index]++
        }
      })
    })
    setJobCounts(jobCount)
  }

  const shangeShow = () => {
    setShow(!show)
  }

  const offEditable = () => {
    setEditable(false)
    setTempSchedule(schedule)
    calculateJobCount(schedule)
  }

  // Почему-то иногда случается двойной вызов
  useEffect(() => {
    let forDropDonwItems = [...entityNames]
    console.log(dropDownItems)
    if (entityNames.indexOf('error') != -1) {
      forDropDonwItems = entityNames.filter((entity) => entity !== 'error')
    }
    forDropDonwItems.push('Выходной')
    setDropDownItems(forDropDonwItems)
    calculateJobCount(schedule)
    setTimeout(() => {
      shangeShow()
    }, 5)
  }, [])

  const onSelectedDwropDown = (selected: string, selecteIndex: number) => {
    if (!editable) {
      setEditable(true)
    }
    if (selected == 'Выходной') {
      setTempSchedule(
        tempSchedule.map((item, index) => (index === selecteIndex ? 'X' : item))
      )
    } else {
      setTempSchedule(
        tempSchedule.map((item, index) =>
          index === selecteIndex
            ? entityIds[entityNames.indexOf(selected)]
            : item
        )
      )
    }

    // Не успевает получить новое значение tempSchedule
    calculateJobCount(tempSchedule)
  }

  interface ScheduleTableProp {
    schedule: string[]
  }

  function ScheduleTable({ schedule }: ScheduleTableProp) {
    return (
      <>
        {schedule.map((day, index) => (
          <DropDown
            onSelected={onSelectedDwropDown}
            className={styles.grid_item}
            options={dropDownItems}
            index={index}
            key={`day-${index}`}
            style={{
              cursor: 'pointer',
              color:
                day == '0'
                  ? 'black'
                  : getContrastTextColor(
                      entityColors[entityIds.indexOf(day) + 1]
                    ),
              backgroundColor: entityColors[entityIds.indexOf(day) + 1],
            }}
          >
            {index + 1}
          </DropDown>
        ))}
      </>
    )
  }

  return (
    <div className={show ? styles.animOn : styles.animOff}>
      <div className={styles.grid_container}>
        {fakeDays.map((_, index) => (
          <div key={`fake-${index}`} className={styles.grid_item}></div>
        ))}
        <ScheduleTable schedule={editable ? tempSchedule : schedule} />
      </div>

      {editable ? (
        <div className={styles.editable_container}>
          <button
            onClick={() => {
              offEditable()
            }}
            className={styles.editable_button}
          >
            Отменить
          </button>
          <button
            onClick={() => onAcceptClick(tempSchedule)}
            className={styles.editable_button}
          >
            Применить
          </button>
        </div>
      ) : null}

      <div className={styles.job_container}>
        {entityIds.map((job, index) => (
          <div
            key={entityNames[index]}
            className={styles.job_item}
            style={{
              color: getContrastTextColor(entityColors[Number(index + 1)]),
              backgroundColor: entityColors[index + 1],
            }}
          >
            {entityNames[index]}
            <div
              style={{
                height: '1px',
                width: '100%',
                backgroundColor: 'black',
              }}
            ></div>
            <div
              style={{
                color: getContrastTextColor(entityColors[Number(index + 1)]),
              }}
              className={styles.job_item}
            >
              {jobCounts[index]}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarGrid
