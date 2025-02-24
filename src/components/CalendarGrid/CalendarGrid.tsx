import { getFirstWeekdayOfMonth } from '@/utils/dateUtils'
import styles from './CalendarGrid.module.css'
import { JobsData } from '@/types/firestore-data'

interface CalendarGridProps {
  schedule: string
  jobs: string[]
  jobsDataList: JobsData[]
}

const CalendarGrid = ({ schedule, jobs, jobsDataList }: CalendarGridProps) => {
  // Преобразуем строку в массив элементов
  const days = schedule.split(',')
  const firstWeekdayOfMonth = getFirstWeekdayOfMonth(2025, 2)
  // Пустые дни
  const fakeDays = new Array(firstWeekdayOfMonth - 1).fill(0)

  const firstColor = '#4CAF50'
  const secondColor = '#ff5252'
  const weekendColor = '#FFFFFF'

  const jobCount = new Array(days.length).fill(0)

  days.map((job) => {
    if (job == jobs[0]) {
      jobCount[0]++
    } else if (job == jobs[1]) {
      jobCount[1]++
    }
  })

  return (
    <>
      <div className={styles.grid_container}>
        <div className={styles.grid_week_days}>ПН</div>
        <div className={styles.grid_week_days}>ВТ</div>
        <div className={styles.grid_week_days}>СР</div>
        <div className={styles.grid_week_days}>ЧТ</div>
        <div className={styles.grid_week_days}>ПТ</div>
        <div className={styles.grid_week_days}>СБ</div>
        <div className={styles.grid_week_days}>ВС</div>
      </div>

      <div className={styles.grid_container}>
        {fakeDays.map((day, index) => (
          <div key={`fake-${index}`} className={styles.grid_item}></div>
        ))}
        {days.map((day, index) => (
          <a
            className={styles.grid_item}
            key={`day-${index}`}
            style={{
              color: day != jobs[0] && day != jobs[1] ? 'black' : '',
              backgroundColor:
                day === jobs[0]
                  ? firstColor
                  : day === jobs[1]
                  ? secondColor
                  : weekendColor,
            }}
          >
            {index + 1}
          </a>
        ))}
      </div>
      <div className={styles.job_container}>
        {jobsDataList.map((job, index) => (
          <div
            key={job.job_name}
            className={styles.job_item}
            style={{
              backgroundColor: index === 0 ? firstColor : secondColor,
            }}
          >
            {job.job_name}
            <div
              style={{ height: '1px', width: '100%', backgroundColor: 'black' }}
            ></div>
            <div className={styles.job_item}>{jobCount[index]}</div>
          </div>
        ))}
      </div>
    </>
  )
}

export default CalendarGrid
