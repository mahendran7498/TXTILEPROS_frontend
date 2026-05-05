export const API_URL = import.meta.env.VITE_API_URL || 'https://txtilepros-backend.vercel.app/api'
export const TOKEN_KEY = 'employee-reporting-token'

export const emptyReportForm = {
  workDate: new Date().toISOString().slice(0, 10),
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
    before: null,
    after: null,
  },
}

export const emptyUserForm = {
  name: '',
  email: '',
  password: '',
  role: 'employee',
  employeeCode: '',
  department: 'Service',
}

export const emptyLeaveForm = {
  leaveDate: new Date().toISOString().slice(0, 10),
  reason: '',
}
