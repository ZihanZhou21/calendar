export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface TaskResponse {
  id: number
  title: string
  totalDuration: number
  totalDays: number
  startDate: string
}
