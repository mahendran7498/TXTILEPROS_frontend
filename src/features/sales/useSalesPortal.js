import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiRequest } from '../reporting/api'
import { TOKEN_KEY } from '../reporting/constants'
import { createEmptySalesEmployeeForm, createEmptySalesOrderForm } from './constants'
import { isOwner, isSalesManager, isSalesUser, readFileAsDataUrl } from './utils'

export default function useSalesPortal() {
  const location = useLocation()
  const navigate = useNavigate()
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(token))
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [dashboard, setDashboard] = useState({})
  const [orders, setOrders] = useState([])
  const [salesUsers, setSalesUsers] = useState([])
  const [form, setForm] = useState(() => createEmptySalesOrderForm())
  const [salesEmployeeForm, setSalesEmployeeForm] = useState(() => createEmptySalesEmployeeForm())

  useEffect(() => {
    document.title = 'TXTILPROS | Sales Module'
  }, [])

  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const data = await apiRequest('/auth/me', {}, token)
        setUser(data.user)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        setToken('')
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [token])

  useEffect(() => {
    if (!user) return

    if (!isSalesUser(user) && !isSalesManager(user) && !isOwner(user)) {
      navigate('/dashboard', { replace: true })
      return
    }

    if (location.pathname === '/sales/login') {
      navigate(isOwner(user) || isSalesManager(user) ? '/sales/admin/orders' : '/sales/dashboard', { replace: true })
    }
  }, [location.pathname, navigate, user])

  useEffect(() => {
    async function loadSalesData() {
      if (!token || !user || (!isSalesUser(user) && !isSalesManager(user) && !isOwner(user))) {
        return
      }

      try {
        const dashboardPromise = apiRequest('/sales/dashboard', {}, token)
        const ordersPromise = isOwner(user) || isSalesManager(user)
          ? apiRequest('/sales/orders/all', {}, token)
          : apiRequest('/sales/orders/mine', {}, token)
        const usersPromise = isOwner(user) || isSalesManager(user) ? apiRequest('/admin/users', {}, token) : Promise.resolve({ users: [] })

        const [dashboardData, ordersData, usersData] = await Promise.all([dashboardPromise, ordersPromise, usersPromise])
        setDashboard(dashboardData.dashboard || {})
        setOrders(ordersData.orders || [])
        setSalesUsers(
          Array.isArray(usersData.users)
            ? usersData.users.filter((candidate) => String(candidate.department || '').toLowerCase() === 'sales')
            : []
        )
      } catch (error) {
        toast.error(error.message)
      }
    }

    loadSalesData()
  }, [location.pathname, token, user])

  async function handleLogin(event) {
    event.preventDefault()
    setLoading(true)

    try {
      const data = await apiRequest('/auth/login', { method: 'POST', body: credentials })
      localStorage.setItem(TOKEN_KEY, data.token)
      setToken(data.token)
      setUser(data.user)
      setCredentials({ email: '', password: '' })

      if (!isSalesUser(data.user) && !isSalesManager(data.user) && !isOwner(data.user)) {
        navigate('/dashboard', { replace: true })
        return
      }

      navigate(isOwner(data.user) || isSalesManager(data.user) ? '/sales/admin/orders' : '/sales/dashboard', { replace: true })
      toast.success(`Welcome back, ${data.user.name}`)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const dataUrl = await readFileAsDataUrl(file)
      setForm((current) => ({
        ...current,
        company_id_photo: {
          name: file.name,
          dataUrl,
        },
      }))
    } catch (error) {
      toast.error(error.message)
    }
  }

  async function handleOrderSubmit(event) {
    event.preventDefault()
    setLoading(true)

    try {
      if (!form.company_id_photo?.dataUrl) {
        throw new Error('Please upload a company ID photo.')
      }

      await apiRequest('/sales/orders', { method: 'POST', body: form }, token)
      setForm(createEmptySalesOrderForm())
      toast.success('Sales order saved')

      const [dashboardData, ordersData] = await Promise.all([
        apiRequest('/sales/dashboard', {}, token),
        apiRequest('/sales/orders/mine', {}, token),
      ])

      setDashboard(dashboardData.dashboard || {})
      setOrders(ordersData.orders || [])
      navigate('/sales/orders', { replace: true })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSalesEmployeeSubmit(event) {
    event.preventDefault()
    setLoading(true)

    try {
      await apiRequest('/admin/users', {
        method: 'POST',
        body: {
          ...salesEmployeeForm,
          role: salesEmployeeForm.role || 'employee',
          department: 'Sales',
        },
      }, token)

      setSalesEmployeeForm(createEmptySalesEmployeeForm())
      toast.success('Sales user created')

      const usersData = await apiRequest('/admin/users', {}, token)
      setSalesUsers(
        Array.isArray(usersData.users)
          ? usersData.users.filter((candidate) => String(candidate.department || '').toLowerCase() === 'sales')
          : []
      )
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
    setUser(null)
    setDashboard({})
    setOrders([])
    setSalesUsers([])
    navigate('/sales/login', { replace: true })
  }

  return {
    credentials,
    dashboard,
    form,
    handleFileChange,
    handleLogin,
    handleLogout,
    handleOrderSubmit,
    handleSalesEmployeeSubmit,
    loading,
    orders,
    path: location.pathname,
    salesEmployeeForm,
    salesUsers,
    setCredentials,
    setForm,
    setSalesEmployeeForm,
    user,
  }
}
