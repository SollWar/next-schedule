export interface UserSchedule {
  [year: string]: {
    [month: string]: string
  }
}

export interface UserData {
  user_name: string
  schedule: UserSchedule
  user_color: string
  jobs: string[]
}

export interface JobsData {
  job_name: string
  users: string[]
  users_rules: string[]
}
