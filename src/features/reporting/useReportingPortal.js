import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { apiRequest } from './api'
import { emptyLeaveForm, emptyReportForm, emptyUserForm, TOKEN_KEY } from './constants'
import { getWeekStartValue } from './utils'

function getMonthValue(date = new Date()) {
  return new Date(date).toISOString().slice(0, 7)
}

export default function useReportingPortal() {
  const navigate = useNavigate()
  const location = useLocation()
  const { reportId } = useParams()
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(null)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [weekStart, setWeekStart] = useState(getWeekStartValue())
  const [attendanceMonth, setAttendanceMonth] = useState(getMonthValue())
  const [reports, setReports] = useState([])
  const [leaves, setLeaves] = useState([])
  const [summary, setSummary] = useState({})
  const [dashboard, setDashboard] = useState({})
  const [attendance, setAttendance] = useState({ daily: [], employees: [] })
  const [users, setUsers] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [form, setForm] = useState(emptyReportForm)
  const [leaveForm, setLeaveForm] = useState(emptyLeaveForm)
  const [userForm, setUserForm] = useState(emptyUserForm)
  const [authLoading, setAuthLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(Boolean(token))
  const [submitting, setSubmitting] = useState(false)
  const [leaveSubmitting, setLeaveSubmitting] = useState(false)
  const [leaveActionLoadingId, setLeaveActionLoadingId] = useState('')
  const [userSaving, setUserSaving] = useState(false)

  const pageTitle = user?.role === 'admin' ? 'Admin Operations Hub' : 'Field Reporting Workspace'

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
      navigate(user.role === 'admin' ? '/dashboard/admin' : '/dashboard', { replace: true })
    }
  }, [location.pathname, navigate, user])

  useEffect(() => {
    if (!user) return
    if (user.role === 'admin' && location.pathname === '/dashboard') {
      navigate('/dashboard/admin', { replace: true })
    }
    if (user.role !== 'admin' && location.pathname.startsWith('/dashboard/admin')) {
      navigate('/dashboard', { replace: true })
    }
  }, [location.pathname, navigate, user])

  async function refreshDashboard() {
    if (!token || !user) return

    try {
      if (user.role === 'admin') {
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
  }, [attendanceMonth, user, weekStart])

  useEffect(() => {
    async function loadSelectedReport() {
      if (!token || user?.role !== 'admin' || !reportId) {
        setSelectedReport(null)
        return
      }

      try {
        const data = await apiRequest(`/admin/reports/${reportId}`, {}, token)
        setSelectedReport(data.report || null)
      } catch (error) {
        setSelectedReport(null)
        toast.error(error.message)
      }
    }

    loadSelectedReport()
  }, [reportId, token, user])

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
      navigate(data.user.role === 'admin' ? '/dashboard/admin' : '/dashboard', { replace: true })
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
      const photos = [form.photos.before, form.photos.after].filter(Boolean)
      if (photos.length !== 2) {
        throw new Error('Please upload both before-work and after-work photos.')
      }

      await apiRequest('/reports', { method: 'POST', body: { ...form, photos, hoursWorked: Number(form.hoursWorked || 0) } }, token)
      setForm({ ...emptyReportForm, workDate: new Date().toISOString().slice(0, 10) })
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
      setLeaveForm(emptyLeaveForm)
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
