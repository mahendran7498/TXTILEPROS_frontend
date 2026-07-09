import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { apiDownload, apiRequest } from './api'
import { createEmptyLeaveForm, createEmptyReportForm, createReportFormFromReport, emptyUserForm, TOKEN_KEY } from './constants'
import { getLocalMonthInputValue, getWeekStartValue } from './utils'

function isSalesDepartment(user) {
  return String(user?.department || '').trim().toLowerCase().includes('sales')
}

function isOwner(user) {
  return user?.role === 'admin'
}

function isServiceManager(user) {
  return user?.role === 'manager' && !isSalesDepartment(user)
}

function canAccessServiceManagement(user) {
  return isOwner(user) || isServiceManager(user)
}

function getManagementBasePath(user) {
  return isOwner(user) ? '/dashboard/admin' : '/dashboard'
}

function getManagementSectionPath(pathname, user) {
  if (!canAccessServiceManagement(user)) return pathname

  const basePath = getManagementBasePath(user)
  if (pathname === '/dashboard/admin' || pathname === '/dashboard') return basePath
  if (pathname.startsWith('/dashboard/admin/')) return `${basePath}${pathname.slice('/dashboard/admin'.length)}`
  if (pathname.startsWith('/dashboard/')) return `${basePath}${pathname.slice('/dashboard'.length)}`
  return pathname
}

export default function useReportingPortal() {
  const navigate = useNavigate()
  const location = useLocation()
  const { reportId } = useParams()
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(null)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [weekStart, setWeekStart] = useState(getWeekStartValue())
  const [attendanceMonth, setAttendanceMonth] = useState(getLocalMonthInputValue())
  const [salaryMonth, setSalaryMonth] = useState(getLocalMonthInputValue())
  const [salaryStatus, setSalaryStatus] = useState('')
  const [reports, setReports] = useState([])
  const [leaves, setLeaves] = useState([])
  const [salaries, setSalaries] = useState([])
  const [auditLogsBySalary, setAuditLogsBySalary] = useState({})
  const [summary, setSummary] = useState({})
  const [dashboard, setDashboard] = useState({})
  const [attendance, setAttendance] = useState({ daily: [], employees: [] })
  const [users, setUsers] = useState([])
  const [contacts, setContacts] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [selectedReportLoading, setSelectedReportLoading] = useState(false)
  const [form, setForm] = useState(() => createEmptyReportForm())
  const [editingReportId, setEditingReportId] = useState('')
  const [leaveForm, setLeaveForm] = useState(() => createEmptyLeaveForm())
  const [userForm, setUserForm] = useState(emptyUserForm)
  const [editSalaryForm, setEditSalaryForm] = useState({})
  const [authLoading, setAuthLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(Boolean(token))
  const [submitting, setSubmitting] = useState(false)
  const [leaveSubmitting, setLeaveSubmitting] = useState(false)
  const [leaveActionLoadingId, setLeaveActionLoadingId] = useState('')
  const [userSaving, setUserSaving] = useState(false)
  const [salarySavingId, setSalarySavingId] = useState('')
  const [salaryHistoryLoadingId, setSalaryHistoryLoadingId] = useState('')
  const [messageStatusUpdatingId, setMessageStatusUpdatingId] = useState('')

  const isAdminUser = canAccessServiceManagement(user)
  const managementBasePath = getManagementBasePath(user)
  const managementSectionPath = getManagementSectionPath(location.pathname, user)
  const pageTitle = isAdminUser ? 'Admin Operations Hub' : 'Field Reporting Workspace'

  useEffect(() => {
    document.title = `TXTILPROS | ${pageTitle}`
  }, [pageTitle])

  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setPageLoading(false)
        return
      }

      try {
        const data = await apiRequest('/auth/me', {}, token)
        setUser(data.user)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        setToken('')
      } finally {
        setPageLoading(false)
      }
    }

    restoreSession()
  }, [token])

  useEffect(() => {
    if (user && location.pathname === '/login') {
      navigate(getManagementBasePath(user), { replace: true })
    }
  }, [location.pathname, navigate, user])

  useEffect(() => {
    if (!user) return
    if (user.role === 'admin' && location.pathname === '/dashboard') {
      navigate('/dashboard/admin', { replace: true })
    }
    if (user.role !== 'admin' && location.pathname.startsWith('/dashboard/admin')) {
      navigate(location.pathname.replace('/dashboard/admin', '/dashboard') || '/dashboard', { replace: true })
    }
    if (user.role !== 'admin' && location.pathname === '/dashboard/salaries') {
      navigate('/dashboard', { replace: true })
    }
  }, [location.pathname, navigate, user])

  async function refreshDashboard() {
    if (!token || !user) return

      try {
      if (canAccessServiceManagement(user)) {
        if (managementSectionPath === managementBasePath) {
          const [dashboardData, reportsData] = await Promise.all([
            apiRequest(`/admin/dashboard?weekStart=${weekStart}`, {}, token),
            apiRequest(`/admin/reports?weekStart=${weekStart}`, {}, token),
          ])

          setDashboard(dashboardData.dashboard || {})
          setReports(reportsData.reports || [])
          return
        }

        if (managementSectionPath === `${managementBasePath}/attendance`) {
          const attendanceData = await apiRequest(`/admin/attendance?month=${attendanceMonth}`, {}, token)
          setAttendance(attendanceData.attendance || { daily: [], employees: [] })
          return
        }

        if (managementSectionPath === `${managementBasePath}/leaves`) {
          const leavesData = await apiRequest('/admin/leaves', {}, token)
          setLeaves(leavesData.leaves || [])
          return
        }

        if (managementSectionPath === `${managementBasePath}/salaries`) {
          const query = new URLSearchParams({ month: salaryMonth })
          if (salaryStatus) query.set('status', salaryStatus)
          const salaryData = await apiRequest(`/salaries?${query.toString()}`, {}, token)
          setSalaries(salaryData.salaries || [])
          return
        }

        if (managementSectionPath === `${managementBasePath}/reports`) {
          const reportsData = await apiRequest(`/admin/reports?weekStart=${weekStart}`, {}, token)
          setReports(reportsData.reports || [])
          return
        }

        if (managementSectionPath.startsWith(`${managementBasePath}/reports/`)) {
          if (!reports.length) {
            const reportsData = await apiRequest(`/admin/reports?weekStart=${weekStart}`, {}, token)
            setReports(reportsData.reports || [])
          }
          return
        }

        if (managementSectionPath === `${managementBasePath}/employees`) {
          const usersData = await apiRequest('/admin/users', {}, token)
          setUsers(usersData.users || [])
          return
        }

        if (isOwner(user) && managementSectionPath === `${managementBasePath}/messages`) {
          const contactsData = await apiRequest('/contact', {}, token)
          setContacts(contactsData.contacts || [])
          return
        }

        const requests = [
          apiRequest(`/admin/dashboard?weekStart=${weekStart}`, {}, token),
          apiRequest(`/admin/reports?weekStart=${weekStart}`, {}, token),
          apiRequest('/admin/users', {}, token),
          apiRequest(`/admin/attendance?month=${attendanceMonth}`, {}, token),
          apiRequest('/admin/leaves', {}, token),
        ]

        if (isOwner(user)) {
          requests.push(apiRequest('/contact', {}, token))
        }

        const [dashboardData, reportsData, usersData, attendanceData, leavesData, contactsData] = await Promise.all(requests)

        setDashboard(dashboardData.dashboard || {})
        setReports(reportsData.reports || [])
        setUsers(usersData.users || [])
        setAttendance(attendanceData.attendance || { daily: [], employees: [] })
        setLeaves(leavesData.leaves || [])
        if (isOwner(user)) {
          setContacts(contactsData?.contacts || [])
        }
        return
      }

      const [summaryData, reportsData, leavesData, salaryData] = await Promise.all([
        apiRequest(`/reports/weekly-summary?weekStart=${weekStart}`, {}, token),
        apiRequest(`/reports/mine?weekStart=${weekStart}`, {}, token),
        apiRequest('/leaves/mine', {}, token),
        apiRequest('/salaries/mine', {}, token),
      ])

      setSummary(summaryData.summary || {})
      setReports(reportsData.reports || [])
      setLeaves(leavesData.leaves || [])
      setSalaries(salaryData.salaries || [])
      setAttendance({ daily: [], employees: [] })
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) {
      refreshDashboard()
    }
  }, [attendanceMonth, location.pathname, managementBasePath, managementSectionPath, salaryMonth, salaryStatus, user, weekStart])

  useEffect(() => {
    async function loadSelectedReport() {
      if (!token || !canAccessServiceManagement(user) || !reportId) {
        setSelectedReport(null)
        setSelectedReportLoading(false)
        return
      }

      const cachedReport = reports.find((report) => String(report._id) === String(reportId)) || null
      if (cachedReport) {
        setSelectedReport((current) => current || cachedReport)
      } else {
        setSelectedReport(null)
      }

      setSelectedReportLoading(true)
      try {
        const data = await apiRequest(`/admin/reports/${reportId}`, { timeoutMs: 15000 }, token)
        setSelectedReport(data.report || null)
      } catch (error) {
        if (!cachedReport) {
          setSelectedReport(null)
        }
        toast.error(error.message)
      } finally {
        setSelectedReportLoading(false)
      }
    }

    loadSelectedReport()
  }, [isAdminUser, reportId, reports, token, user])

  async function handleLogin(event) {
    event.preventDefault()
    setAuthLoading(true)

    try {
      const data = await apiRequest('/auth/login', { method: 'POST', body: credentials })
      localStorage.setItem(TOKEN_KEY, data.token)
      setToken(data.token)
      setUser(data.user)
      setCredentials({ email: '', password: '' })
      toast.success(`Welcome back, ${data.user.name}`)
      navigate(getManagementBasePath(data.user), { replace: true })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setAuthLoading(false)
    }
  }

  async function handleReportSubmit(event) {
    event.preventDefault()
    setSubmitting(true)

    try {
      const beforePhotos = Array.isArray(form.photos.before) ? form.photos.before : []
      const photos = [...beforePhotos, form.photos.after].filter(Boolean)
      if (!beforePhotos.length || !form.photos.after) {
        throw new Error('Please upload at least one before-work photo and one after-work photo.')
      }

      const payload = { ...form, photos, hoursWorked: Number(form.hoursWorked || 0) }
      if (editingReportId) {
        await apiRequest(`/reports/${editingReportId}`, { method: 'PATCH', body: payload }, token)
      } else {
        await apiRequest('/reports', { method: 'POST', body: payload }, token)
      }
      setForm(createEmptyReportForm())
      setEditingReportId('')
      toast.success(editingReportId ? 'Work report updated' : 'Work report saved')
      await refreshDashboard()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  function handleEditReport(report) {
    setForm(createReportFormFromReport(report))
    setEditingReportId(String(report._id || ''))
  }

  function handleCancelReportEdit() {
    setForm(createEmptyReportForm())
    setEditingReportId('')
  }

  async function handleUserSubmit(event) {
    event.preventDefault()
    setUserSaving(true)

    try {
      await apiRequest('/admin/users', { method: 'POST', body: userForm }, token)
      setUserForm(emptyUserForm)
      toast.success('User created')
      await refreshDashboard()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setUserSaving(false)
    }
  }

  async function handleLeaveSubmit(event) {
    event.preventDefault()
    setLeaveSubmitting(true)

    try {
      await apiRequest('/leaves', { method: 'POST', body: leaveForm }, token)
      setLeaveForm(createEmptyLeaveForm())
      toast.success('Leave request submitted')
      await refreshDashboard()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLeaveSubmitting(false)
    }
  }

  async function handleLeaveDecision(leaveId, status, adminComment = '') {
    setLeaveActionLoadingId(leaveId)

    try {
      await apiRequest(`/admin/leaves/${leaveId}`, { method: 'PATCH', body: { status, adminComment } }, token)
      toast.success(`Leave request ${status}`)
      await refreshDashboard()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLeaveActionLoadingId('')
    }
  }

  async function handleContactStatusUpdate(contactId, status) {
    setMessageStatusUpdatingId(contactId)

    try {
      const updatedContact = await apiRequest(`/contact/${contactId}/status`, { method: 'PATCH', body: { status } }, token)
      setContacts((current) => current.map((contact) => (contact._id === contactId ? updatedContact : contact)))
      toast.success(`Message marked ${status}`)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setMessageStatusUpdatingId('')
    }
  }

  async function handleUserToggle(targetUser) {
    try {
      await apiRequest(`/admin/users/${targetUser.id || targetUser._id}`, { method: 'PATCH', body: { active: !targetUser.active } }, token)
      toast.success(`User ${targetUser.active ? 'disabled' : 'enabled'}`)
      await refreshDashboard()
    } catch (error) {
      toast.error(error.message)
    }
  }

  function handleSalaryEditChange(field, value) {
    setEditSalaryForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSalarySave(event, salary) {
    event.preventDefault()
    setSalarySavingId(salary._id)

    try {
      const data = await apiRequest(`/salaries/${salary._id}`, { method: 'PATCH', body: editSalaryForm }, token)
      setSalaries((current) => current.map((item) => (item._id === salary._id ? data.salary : item)))
      toast.success('Salary updated and net salary recalculated')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSalarySavingId('')
    }
  }

  async function handleSalaryApprove(salary) {
    setSalarySavingId(salary._id)

    try {
      const data = await apiRequest(`/salaries/${salary._id}/approve`, { method: 'POST' }, token)
      setSalaries((current) => current.map((item) => (item._id === salary._id ? data.salary : item)))
      toast.success('Salary approved')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSalarySavingId('')
    }
  }

  async function handleSalaryGeneratePayslip(salary) {
    setSalarySavingId(salary._id)

    try {
      const data = await apiRequest(`/salaries/${salary._id}/generate-payslip`, { method: 'POST' }, token)
      setSalaries((current) => current.map((item) => (item._id === salary._id ? data.salary : item)))
      toast.success('Payslip generated')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSalarySavingId('')
    }
  }

  async function handleSalaryResendEmail(salary) {
    setSalarySavingId(salary._id)

    try {
      const data = await apiRequest(`/salaries/${salary._id}/resend-email`, { method: 'POST' }, token)
      setSalaries((current) => current.map((item) => (item._id === salary._id ? data.salary : item)))
      toast.success(data.salary.emailDeliveryStatus === 'sent' ? 'Payslip email sent' : `Email ${data.salary.emailDeliveryStatus}`)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSalarySavingId('')
    }
  }

  async function handleSalaryHistoryLoad(salaryId) {
    setSalaryHistoryLoadingId(salaryId)

    try {
      const data = await apiRequest(`/salaries/${salaryId}/audit-logs`, {}, token)
      setAuditLogsBySalary((current) => ({ ...current, [salaryId]: data.logs || [] }))
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSalaryHistoryLoadingId('')
    }
  }

  async function handleSalaryDownload(salary) {
    try {
      const monthName = new Date(salary.year, salary.month - 1, 1).toLocaleDateString('en-US', { month: 'long' })
      await apiDownload(`/salaries/${salary._id}/payslip`, `SalarySlip_${monthName}_${salary.year}.pdf`, token)
    } catch (error) {
      toast.error(error.message)
    }
  }

  async function handleEmployeePayslipDownload(salary) {
    try {
      const monthName = new Date(salary.year, salary.month - 1, 1).toLocaleDateString('en-US', { month: 'long' })
      await apiDownload(`/salaries/mine/${salary._id}/payslip`, `SalarySlip_${monthName}_${salary.year}.pdf`, token)
    } catch (error) {
      toast.error(error.message)
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
    setUser(null)
    setReports([])
    setLeaves([])
    setSalaries([])
    setContacts([])
    setAuditLogsBySalary({})
    setUsers([])
    setSummary({})
    setDashboard({})
    setAttendance({ daily: [], employees: [] })
    setSelectedReport(null)
    navigate('/login', { replace: true })
  }

  return {
    attendance,
    attendanceMonth,
    auditLogsBySalary,
    authLoading,
    contacts,
    credentials,
    dashboard,
    editSalaryForm,
    form,
    editingReportId,
    handleLeaveDecision,
    handleEditReport,
    handleLogin,
    handleLogout,
    handleCancelReportEdit,
    handleContactStatusUpdate,
    handleLeaveSubmit,
    handleReportSubmit,
    handleEmployeePayslipDownload,
    handleSalaryApprove,
    handleSalaryDownload,
    handleSalaryEditChange,
    handleSalaryGeneratePayslip,
    handleSalaryHistoryLoad,
    handleSalaryResendEmail,
    handleSalarySave,
    handleUserSubmit,
    handleUserToggle,
    isAuthenticated: Boolean(token && user),
    leaveActionLoadingId,
    leaveForm,
    leaveSubmitting,
    leaves,
    locationPath: location.pathname,
    managementBasePath,
    managementSectionPath: reportId ? `${managementBasePath}/reports` : managementSectionPath,
    messageStatusUpdatingId,
    pageLoading,
    refreshDashboard,
    reportId,
    reports,
    salaries,
    salaryHistoryLoadingId,
    salaryMonth,
    salarySavingId,
    salaryStatus,
    selectedReport,
    selectedReportLoading,
    setCredentials,
    setForm,
    setAttendanceMonth,
    setEditSalaryForm,
    setLeaveForm,
    setSalaryMonth,
    setSalaryStatus,
    setUserForm,
    setWeekStart,
    submitting,
    summary,
    user,
    userForm,
    userSaving,
    users,
    weekStart,
  }
}
