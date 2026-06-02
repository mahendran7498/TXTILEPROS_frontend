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

export function createReportFormFromReport(report) {
  const photos = Array.isArray(report?.photos) ? report.photos : []

  return {
    workDate: report?.workDate ? String(report.workDate).slice(0, 10) : getLocalDateInputValue(),
    siteName: report?.siteName || '',
    clientName: report?.clientName || '',
    machineName: report?.machineName || '',
    shift: report?.shift || 'General',
    hoursWorked: String(report?.hoursWorked ?? '8'),
    workSummary: report?.workSummary || '',
    problemsObserved: report?.problemsObserved || '',
    materialsUsed: report?.materialsUsed || '',
    status: report?.status || 'completed',
    photos: {
      before: photos.filter((photo) => String(photo?.kind || '').toLowerCase() === 'before'),
      after: photos.find((photo) => String(photo?.kind || '').toLowerCase() === 'after') || null,
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
  phone: '',
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
