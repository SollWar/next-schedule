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
  jobs_rules: JobsRules
  permissions: string[]
  jobs: string[]
}

export interface JobData {
  id: string
  job_name: string
  job_color: string
  users: string[]
}

export interface JobsRules {
  [job_id: string]: '0' | '1'
}
