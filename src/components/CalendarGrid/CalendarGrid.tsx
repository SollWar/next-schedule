'use client'
import { getFirstWeekdayOfMonth } from '@/utils/dateUtils'
import styles from './CalendarGrid.module.css'
import { getContrastTextColor } from '@/utils/colorsUtils'
import { useEffect, useState } from 'react'
import DropDown from '../Share/DropDown/DropDown'
import { JobsRules } from '@/types/firestore-data'
//import { useState } from 'react'

export interface CalendarGridProps {
  schedule: string[]
  entityIds: string[]
  entityNames: string[]
  entityColors: string[]
  fakeDaysNumber: number
  editableRules: JobsRules | boolean
  onAcceptClick?: (newSchedule: string[]) => void
}

const CalendarGrid = ({
  schedule,
  entityIds,
  entityNames,
  entityColors,
  fakeDaysNumber,
  editableRules,
  onAcceptClick,
}: CalendarGridProps) => {
  const [show, setShow] = useState(false)
  const [editable, setEditable] = useState(false)
  const [tempSchedule, setTempSchedule] = useState<string[]>([])
  const [jobCounts, setJobCounts] = useState<number[]>([])
  const [dropDownItems, setDropDownItems] = useState<string[]>([''])
  const [update, setUpdate] = useState<boolean>(false)
  const [fakeDays, setFakeDays] = useState<number[]>([])

  const calculateJobCount = (schedule: string[]) => {
    const jobCount = new Array(entityNames.length).fill(0)
    schedule.map((day) => {
      entityIds.map((job, index) => {
        if (day == job) {
          jobCount[index]++
        } else if (day === 'error') {
          jobCount[index]++
        }
      })
    })
    setJobCounts(jobCount)
  }

  const offEditable = () => {
    setEditable(false)
    setTempSchedule(schedule)
    calculateJobCount(schedule)
  }

  const getEditableRulesForDay = (day: string) => {
    if (typeof editableRules == 'boolean') {
      return editableRules
    } else {
      return editableRules[day] === '1'
        ? true
        : editableRules[day] == undefined
        ? true
        : false
    }
  }

  useEffect(() => {
    setFakeDays(new Array(fakeDaysNumber - 1).fill(0))
    setUpdate(false)
    setTempSchedule(schedule)
    let forDropDonwItems: string[] = []
    console.log(entityNames)
    console.log(editableRules)
    if (typeof editableRules != 'boolean') {
      entityNames.map((value, index) => {
        console.log(value, editableRules[index + 1])
        if (editableRules[index + 1] === '1') {
          forDropDonwItems.push(value)
        }
      })
    }
    if (forDropDonwItems.length > 0) {
      forDropDonwItems.push('Выходной')
    }
    setDropDownItems(forDropDonwItems)
    calculateJobCount(schedule)
    setTimeout(() => {
      setShow(true)
    }, 5)
  }, [schedule, entityIds, entityNames])

  const onSelectedDwropDown = (selected: string, selecteIndex: number) => {
    if (entityIds[entityNames.indexOf(selected)] != schedule[selecteIndex]) {
      if (!editable) {
        setEditable(true)
      }

      const newTempSchedule = tempSchedule.map((item, index) => {
        if (index !== selecteIndex) return item
        return selected === 'Выходной'
          ? 'X'
          : entityIds[entityNames.indexOf(selected)]
      })

      setTempSchedule(newTempSchedule)
      calculateJobCount(newTempSchedule)
    }
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
            disabled={!getEditableRulesForDay(day)}
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
            disabled={update}
            style={{
              color: update ? 'gray' : 'black',
              cursor: update ? 'default' : 'pointer',
            }}
            className={styles.editable_button}
          >
            Отменить
          </button>
          <button
            onClick={() => {
              onAcceptClick!(tempSchedule)
              setUpdate(true)
            }}
            disabled={update}
            style={{
              cursor: update ? 'default' : 'pointer',
            }}
            className={styles.editable_button}
          >
            {update ? <div className={styles.loader}></div> : <>Применить</>}
          </button>
        </div>
      ) : null}

      <div className={styles.job_container}>
        {entityNames.map((job, index) => (
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
