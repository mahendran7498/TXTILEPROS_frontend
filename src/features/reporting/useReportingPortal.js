import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { apiRequest } from './api'
import { createEmptyLeaveForm, createEmptyReportForm, emptyUserForm, TOKEN_KEY } from './constants'
import { getLocalMonthInputValue, getWeekStartValue } from './utils'

function isSalesDepartment(user) {
  return String(user?.department || '').trim().toLowerCase() === 'sales'
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

export default function useReportingPortal() {
  const navigate = useNavigate()
  const location = useLocation()
  const { reportId } = useParams()
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(null)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [weekStart, setWeekStart] = useState(getWeekStartValue())
  const [attendanceMonth, setAttendanceMonth] = useState(getLocalMonthInputValue())
  const [reports, setReports] = useState([])
  const [leaves, setLeaves] = useState([])
  const [summary, setSummary] = useState({})
  const [dashboard, setDashboard] = useState({})
  const [attendance, setAttendance] = useState({ daily: [], employees: [] })
  const [users, setUsers] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [selectedReportLoading, setSelectedReportLoading] = useState(false)
  const [form, setForm] = useState(() => createEmptyReportForm())
  const [leaveForm, setLeaveForm] = useState(() => createEmptyLeaveForm())
  const [userForm, setUserForm] = useState(emptyUserForm)
  const [authLoading, setAuthLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(Boolean(token))
  const [submitting, setSubmitting] = useState(false)
  const [leaveSubmitting, setLeaveSubmitting] = useState(false)
  const [leaveActionLoadingId, setLeaveActionLoadingId] = useState('')
  const [userSaving, setUserSaving] = useState(false)

  const pageTitle = canAccessServiceManagement(user) ? 'Service Management Hub' : 'Field Reporting Workspace'

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
      navigate(
        isOwner(user) ? '/owner/dashboard' : isSalesDepartment(user) ? '/sales/dashboard' : canAccessServiceManagement(user) ? '/dashboard/admin' : '/dashboard',
        { replace: true }
      )
    }
  }, [location.pathname, navigate, user])

  useEffect(() => {
    if (!user) return
    if (isSalesDepartment(user)) {
      navigate('/sales/dashboard', { replace: true })
      return
    }
    if (canAccessServiceManagement(user) && location.pathname === '/dashboard') {
      navigate(isOwner(user) ? '/owner/dashboard' : '/dashboard/admin', { replace: true })
      return
    }
    if (!canAccessServiceManagement(user) && location.pathname.startsWith('/dashboard/admin')) {
      navigate('/dashboard', { replace: true })
    }
  }, [location.pathname, navigate, user])

  async function refreshDashboard() {
    if (!token || !user) return

    try {
      if (canAccessServiceManagement(user)) {
        if (location.pathname === '/dashboard/admin') {
          const [dashboardData, reportsData] = await Promise.all([
            apiRequest(`/admin/dashboard?weekStart=${weekStart}`, {}, token),
            apiRequest(`/admin/reports?weekStart=${weekStart}`, {}, token),
          ])

          setDashboard(dashboardData.dashboard || {})
          setReports(reportsData.reports || [])
          return
        }

        if (location.pathname === '/dashboard/admin/attendance') {
          const attendanceData = await apiRequest(`/admin/attendance?month=${attendanceMonth}`, {}, token)
          setAttendance(attendanceData.attendance || { daily: [], employees: [] })
          return
        }

        if (location.pathname === '/dashboard/admin/leaves') {
          const leavesData = await apiRequest('/admin/leaves', {}, token)
          setLeaves(leavesData.leaves || [])
          return
        }

        if (location.pathname === '/dashboard/admin/reports') {
          const reportsData = await apiRequest(`/admin/reports?weekStart=${weekStart}`, {}, token)
          setReports(reportsData.reports || [])
          return
        }

        if (location.pathname.startsWith('/dashboard/admin/reports/')) {
          if (!reports.length) {
            const reportsData = await apiRequest(`/admin/reports?weekStart=${weekStart}`, {}, token)
            setReports(reportsData.reports || [])
          }
          return
        }

        if (location.pathname === '/dashboard/admin/employees') {
          const usersData = await apiRequest('/admin/users', {}, token)
          setUsers(usersData.users || [])
          return
        }

        const [dashboardData, reportsData, usersData, attendanceData, leavesData] = await Promise.all([
          apiRequest(`/admin/dashboard?weekStart=${weekStart}`, {}, token),
          apiRequest(`/admin/reports?weekStart=${weekStart}`, {}, token),
          apiRequest('/admin/users', {}, token),
          apiRequest(`/admin/attendance?month=${attendanceMonth}`, {}, token),
          apiRequest('/admin/leaves', {}, token),
        ])

        setDashboard(dashboardData.dashboard || {})
        setReports(reportsData.reports || [])
        setUsers(usersData.users || [])
        setAttendance(attendanceData.attendance || { daily: [], employees: [] })
        setLeaves(leavesData.leaves || [])
        return
      }

      const [summaryData, reportsData, leavesData] = await Promise.all([
        apiRequest(`/reports/weekly-summary?weekStart=${weekStart}`, {}, token),
        apiRequest(`/reports/mine?weekStart=${weekStart}`, {}, token),
        apiRequest('/leaves/mine', {}, token),
      ])

      setSummary(summaryData.summary || {})
      setReports(reportsData.reports || [])
      setLeaves(leavesData.leaves || [])
      setAttendance({ daily: [], employees: [] })
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) {
      refreshDashboard()
    }
  }, [attendanceMonth, location.pathname, user, weekStart])

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
  }, [reportId, reports, token, user])

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
      navigate(
        isOwner(data.user) ? '/owner/dashboard' : isSalesDepartment(data.user) ? '/sales/dashboard' : canAccessServiceManagement(data.user) ? '/dashboard/admin' : '/dashboard',
        { replace: true }
      )
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

      await apiRequest('/reports', { method: 'POST', body: { ...form, photos, hoursWorked: Number(form.hoursWorked || 0) } }, token)
      setForm(createEmptyReportForm())
      toast.success('Work report saved')
      await refreshDashboard()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
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

  async function handleUserToggle(targetUser) {
    try {
      await apiRequest(`/admin/users/${targetUser.id || targetUser._id}`, { method: 'PATCH', body: { active: !targetUser.active } }, token)
      toast.success(`User ${targetUser.active ? 'disabled' : 'enabled'}`)
      await refreshDashboard()
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
    setUsers([])
    setSummary({})
    setDashboard({})
    setAttendance({ daily: [], employees: [] })
    setSelectedReport(null)
    navigate('/login', { replace: true })
  }

  return {
    adminSectionPath: reportId ? '/dashboard/admin/reports' : location.pathname,
    attendance,
    attendanceMonth,
    authLoading,
    credentials,
    dashboard,
    form,
    handleLeaveDecision,
    handleLogin,
    handleLogout,
    handleLeaveSubmit,
    handleReportSubmit,
    handleUserSubmit,
    handleUserToggle,
    isAuthenticated: Boolean(token && user),
    leaveActionLoadingId,
    leaveForm,
    leaveSubmitting,
    leaves,
    locationPath: location.pathname,
    pageLoading,
    refreshDashboard,
    reportId,
    reports,
    selectedReport,
    selectedReportLoading,
    setCredentials,
    setForm,
    setAttendanceMonth,
    setLeaveForm,
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
