import { getLocalDateInputValue } from './utils'

export const API_URL = import.meta.env.VITE_API_URL || 'https://txtilepros-backend.vercel.app/api'
export const TOKEN_KEY = 'employee-reporting-token'
export const MAX_REPORT_PHOTO_SIZE_BYTES = 3 * 1024 * 1024
export const MAX_BEFORE_WORK_PHOTOS = 4

export function createEmptyReportForm() {
  return {
    workDate: getLocalDateInputValue(),
    siteName: '',
    clientName: '',
    machineName: '',
    shift: 'General',
    hoursWorked: '8',
    workSummary: '',
    problemsObserved: '',
    materialsUsed: '',
    status: 'completed',
    photos: {
      before: [],
      after: null,
    },
  }
}

export const emptyReportForm = createEmptyReportForm()

export const emptyUserForm = {
  name: '',
  email: '',
  password: '',
  role: 'employee',
  employeeCode: '',
  department: 'Service',
}

export function createEmptyLeaveForm() {
  const today = getLocalDateInputValue()

  return {
    fromDate: today,
    toDate: today,
    reason: '',
  }
}

export const emptyLeaveForm = createEmptyLeaveForm()
