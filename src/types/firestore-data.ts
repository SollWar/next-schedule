export interface UserSchedule {
  [year: string]: {
    [month: string]: string
  }
}

export interface UserData {
  id: string
  user_name: string
  schedule: UserSchedule
  user_color: string
  jobs: string[]
}

export interface JobData {
  job_name: string
  job_color: string
  users: string[]
  users_rules: string[]
}
