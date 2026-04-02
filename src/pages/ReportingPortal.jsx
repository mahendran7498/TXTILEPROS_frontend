import { useEffect, useMemo, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Footer from '../components/Footer'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const MEDIA_ORIGIN = (import.meta.env.VITE_MEDIA_URL || API_URL.replace(/\/api$/, '')).replace(/\/$/, '')
const TOKEN_KEY = 'employee-reporting-token'

const emptyReportForm = {
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

const emptyUserForm = {
  name: '',
  email: '',
  password: '',
  role: 'employee',
  employeeCode: '',
  department: 'Service',
}

function getWeekStartValue(date = new Date()) {
  const value = new Date(date)
  value.setHours(0, 0, 0, 0)
  const day = value.getDay()
  const diff = day === 0 ? -6 : 1 - day
  value.setDate(value.getDate() + diff)
  return value.toISOString().slice(0, 10)
}

async function apiRequest(path, options = {}, token) {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Request failed')
  return data
}

function readFiles(files) {
  return Promise.all(
    Array.from(files)
      .slice(0, 4)
      .map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve({ name: file.name, size: file.size, type: file.type, dataUrl: reader.result })
            reader.onerror = () => reject(new Error(`Unable to read ${file.name}`))
            reader.readAsDataURL(file)
          })
      )
  )
}

async function readSingleFile(file, kind) {
  const [photo] = await readFiles([file])
  return { ...photo, kind }
}

function normalizeReportPhotos(photos = []) {
  const items = Array.isArray(photos) ? photos : []
  let beforeAssigned = false
  let afterAssigned = false

  return items.map((photo, index) => {
    const rawKind = String(photo?.kind || '').toLowerCase()

    if (rawKind === 'before' && !beforeAssigned) {
      beforeAssigned = true
      return { ...photo, displayKind: 'before' }
    }

    if (rawKind === 'after' && !afterAssigned) {
      afterAssigned = true
      return { ...photo, displayKind: 'after' }
    }

    if (!beforeAssigned) {
      beforeAssigned = true
      return { ...photo, displayKind: 'before' }
    }

    if (!afterAssigned) {
      afterAssigned = true
      return { ...photo, displayKind: 'after' }
    }

    return { ...photo, displayKind: index === 0 ? 'before' : 'after' }
  })
}

function StatCard({ label, value, hint }) {
  return (
    <article className="stat-card glass-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </article>
  )
}

function TopCornerActions({ showAuthButtons, onLoginClick, onRegisterClick, onSettingsClick }) {
  return (
    <div className="top-corner-actions">
      <button className="ghost-button top-corner-button" onClick={onSettingsClick} type="button">
        Settings
      </button>
      {showAuthButtons ? (
        <>
          <button className="secondary-button top-corner-button" onClick={onLoginClick} type="button">
            Login
          </button>
          <button className="primary-button top-corner-button" onClick={onRegisterClick} type="button">
            Register
          </button>
        </>
      ) : null}
    </div>
  )
}

function LoginScreen({ credentials, loading, setCredentials, onSubmit }) {
  return (
    <div className="login-shell">
      <section className="login-panel glass-card">
        <div className="eyebrow">TXTILPROS service reporting</div>
        <h1>Employee Work Reporting</h1>
        <p className="lead">
          Daily updates, machine issues, photo uploads, weekly summaries, and admin visibility for textile machinery service teams.
        </p>

        <form className="stack-lg" onSubmit={onSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              id="login-email"
              required
              type="email"
              value={credentials.email}
              onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
              placeholder="employee@txtilpros.local"
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              required
              type="password"
              value={credentials.password}
              onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
              placeholder="Enter your password"
            />
          </label>
          <button className="primary-button" disabled={loading} type="submit">
            {loading ? 'Signing in...' : 'Login to dashboard'}
          </button>
        </form>
      </section>
    </div>
  )
}

function DashboardHeader({ user, weekStart, setWeekStart, refresh, onLogout }) {
  return (
    <header className="dashboard-header">
      <div>
        <div className="eyebrow">Secure reporting workspace</div>
        <h2>{user.role === 'admin' ? 'Admin dashboard' : 'Employee dashboard'}</h2>
        <p className="muted">
          Signed in as {user.name} ({user.role}){user.department ? ` | ${user.department}` : ''}
        </p>
      </div>
      <div className="header-actions">
        <label className="field compact-field">
          <span>Week starting</span>
          <input type="date" value={weekStart} onChange={(event) => setWeekStart(event.target.value)} />
        </label>
        <button className="secondary-button" onClick={refresh} type="button">
          Refresh
        </button>
        <button className="ghost-button" onClick={onLogout} type="button">
          Logout
        </button>
      </div>
    </header>
  )
}

function AdminNavigation({ activePath }) {
  const items = [
    { label: 'Overview', path: '/dashboard/admin' },
    { label: 'Reports', path: '/dashboard/admin/reports' },
    { label: 'Employees', path: '/dashboard/admin/employees' },
  ]

  return (
    <nav className="glass-card section-card" style={{ padding: 12 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {items.map((item) => {
          const active = activePath === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                padding: '10px 16px',
                borderRadius: 999,
                textDecoration: 'none',
                fontWeight: 600,
                color: active ? 'white' : 'var(--ink, #1e293b)',
                background: active ? '#1f6c52' : 'rgba(255,255,255,0.75)',
                border: active ? '1px solid #1f6c52' : '1px solid rgba(15,23,42,0.08)',
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function ReportList({ reports, showEmployee, title }) {
  return (
    <section className="glass-card section-card">
      <div className="section-head">
        <div>
          <div className="eyebrow">Report stream</div>
          <h3>{title}</h3>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="empty-state">No reports found for the selected week.</div>
      ) : (
        <div className="report-list">
          {reports.map((report) => (
            <article className="report-card" key={report._id}>
              <div className="report-topline">
                <div>
                  <h4>{report.siteName}</h4>
                  <p className="muted">
                    {new Date(report.workDate).toLocaleDateString()} | {report.shift} | {report.hoursWorked} hrs
                  </p>
                </div>
                <span className={`status-pill status-${report.status}`}>{report.status.replace('-', ' ')}</span>
              </div>

              {showEmployee && report.user ? (
                <p className="muted">
                  {report.user.name} | {report.user.employeeCode || report.user.email}
                </p>
              ) : null}

              {report.machineName ? <p><strong>Machine:</strong> {report.machineName}</p> : null}
              {report.clientName ? <p><strong>Client:</strong> {report.clientName}</p> : null}
              <p><strong>Work:</strong> {report.workSummary}</p>
              {report.problemsObserved ? <p><strong>Problems:</strong> {report.problemsObserved}</p> : null}
              {report.materialsUsed ? <p><strong>Materials:</strong> {report.materialsUsed}</p> : null}

              <div className="report-footer">
                <span>Sheets sync: {report.sheetsSync?.status || 'pending'}</span>
                <span>{report.photos?.length || 0} photos</span>
              </div>

              {report.photos?.length ? (
                <div className="report-photos">
                  {normalizeReportPhotos(report.photos).map((photo) => (
                    <a href={`${MEDIA_ORIGIN}${photo.url}`} key={photo.url} rel="noreferrer" target="_blank">
                      <span className="photo-label">{photo.displayKind === 'before' ? 'Before work' : 'After work'}</span>
                      <img alt={photo.originalName} src={`${MEDIA_ORIGIN}${photo.url}`} />
                    </a>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function ReportForm({ form, setForm, submitting, onSubmit }) {
  async function handleFileChange(event, kind) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const photo = await readSingleFile(file, kind)
      setForm((current) => ({
        ...current,
        photos: {
          ...current.photos,
          [kind]: photo,
        },
      }))
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <section className="glass-card section-card">
      <div className="section-head">
        <div>
          <div className="eyebrow">Daily update</div>
          <h3>Submit work report</h3>
        </div>
        <p className="muted">Capture work done, issue details, materials used, and site photos from the field.</p>
      </div>

      <form className="report-grid" onSubmit={onSubmit}>
        <label className="field">
          <span>Work date</span>
          <input required type="date" value={form.workDate} onChange={(event) => setForm((current) => ({ ...current, workDate: event.target.value }))} />
        </label>
        <label className="field">
          <span>Site name</span>
          <input required value={form.siteName} onChange={(event) => setForm((current) => ({ ...current, siteName: event.target.value }))} placeholder="Mill or branch" />
        </label>
        <label className="field">
          <span>Client name</span>
          <input value={form.clientName} onChange={(event) => setForm((current) => ({ ...current, clientName: event.target.value }))} />
        </label>
        <label className="field">
          <span>Machine name</span>
          <input value={form.machineName} onChange={(event) => setForm((current) => ({ ...current, machineName: event.target.value }))} placeholder="Air Jet Loom / model" />
        </label>
        <label className="field">
          <span>Shift</span>
          <select value={form.shift} onChange={(event) => setForm((current) => ({ ...current, shift: event.target.value }))}>
            {['General', 'Morning', 'Afternoon', 'Night'].map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Hours worked</span>
          <input type="number" min="0" max="24" step="0.5" value={form.hoursWorked} onChange={(event) => setForm((current) => ({ ...current, hoursWorked: event.target.value }))} />
        </label>
        <label className="field field-wide">
          <span>Work summary</span>
          <textarea required rows="4" value={form.workSummary} onChange={(event) => setForm((current) => ({ ...current, workSummary: event.target.value }))} />
        </label>
        <label className="field">
          <span>Problems observed</span>
          <textarea rows="4" value={form.problemsObserved} onChange={(event) => setForm((current) => ({ ...current, problemsObserved: event.target.value }))} />
        </label>
        <label className="field">
          <span>Materials used</span>
          <textarea rows="4" value={form.materialsUsed} onChange={(event) => setForm((current) => ({ ...current, materialsUsed: event.target.value }))} />
        </label>
        <label className="field">
          <span>Status</span>
          <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>
            <option value="completed">Completed</option>
            <option value="needs-support">Needs support</option>
            <option value="blocked">Blocked</option>
          </select>
        </label>
        <label className="field">
          <span>Before work photo</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleFileChange(event, 'before')} />
          <small>Upload the machine/site condition before starting work.</small>
        </label>
        <label className="field">
          <span>After work photo</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleFileChange(event, 'after')} />
          <small>Upload the final condition after the job is finished.</small>
        </label>

        <div className="field-wide photo-preview-grid">
          {!form.photos.before && !form.photos.after ? <div className="empty-state small-empty">Before and after photo previews will appear here.</div> : null}
          {Object.values(form.photos).filter(Boolean).map((photo) => (
            <div className="photo-chip" key={photo.kind}>
              <span className="photo-label photo-chip-label">{photo.kind === 'before' ? 'Before work' : 'After work'}</span>
              <img alt={photo.name} src={photo.dataUrl} />
              <span>{photo.name}</span>
            </div>
          ))}
        </div>

        <button className="primary-button field-wide" disabled={submitting} type="submit">
          {submitting ? 'Submitting report...' : 'Save work report'}
        </button>
      </form>
    </section>
  )
}

function UserManagement({ users, form, setForm, saving, onSubmit, onToggle }) {
  return (
    <section className="glass-card section-card">
      <div className="section-head">
        <div>
          <div className="eyebrow">Access control</div>
          <h3>Manage employees</h3>
        </div>
        <p className="muted">Create accounts and quickly enable or disable access from the dashboard.</p>
      </div>

      <form className="report-grid" onSubmit={onSubmit}>
        <label className="field"><span>Name</span><input required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></label>
        <label className="field"><span>Email</span><input required type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></label>
        <label className="field"><span>Password</span><input required type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} /></label>
        <label className="field">
          <span>Role</span>
          <select value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <label className="field"><span>Employee code</span><input value={form.employeeCode} onChange={(event) => setForm((current) => ({ ...current, employeeCode: event.target.value }))} /></label>
        <label className="field"><span>Department</span><input value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))} /></label>
        <button className="primary-button field-wide" disabled={saving} type="submit">{saving ? 'Saving user...' : 'Create user'}</button>
      </form>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Code</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id || user._id}>
                <td><strong>{user.name}</strong><div className="muted">{user.email}</div></td>
                <td>{user.role}</td>
                <td>{user.department || '-'}</td>
                <td>{user.employeeCode || '-'}</td>
                <td>{user.active ? 'Active' : 'Disabled'}</td>
                <td><button className="ghost-button inline-button" onClick={() => onToggle(user)} type="button">{user.active ? 'Disable' : 'Enable'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function AdminReportsView({ reports, title = 'All employee submissions', subtitle = 'Review weekly work reports and open any report for full details.' }) {
  return (
    <section className="glass-card section-card">
      <div className="section-head">
        <div>
          <div className="eyebrow">Reports</div>
          <h3>{title}</h3>
        </div>
        <p className="muted">{subtitle}</p>
      </div>

      {reports.length === 0 ? (
        <div className="empty-state">No reports found for the selected week.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Site</th>
                <th>Status</th>
                <th>Hours</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td>{new Date(report.workDate).toLocaleDateString()}</td>
                  <td>
                    <strong>{report.user?.name || 'Unknown'}</strong>
                    <div className="muted">{report.user?.employeeCode || report.user?.email || '-'}</div>
                  </td>
                  <td>
                    <strong>{report.siteName}</strong>
                    <div className="muted">{report.machineName || 'Machine not added'}</div>
                  </td>
                  <td><span className={`status-pill status-${report.status}`}>{report.status.replace('-', ' ')}</span></td>
                  <td>{report.hoursWorked || 0}</td>
                  <td>
                    <Link className="ghost-button inline-button" to={`/dashboard/admin/reports/${report._id}`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function AdminOverview({ dashboard, reports }) {
  return (
    <>
      <section className="stat-grid">
        <StatCard label="Employees" value={dashboard.totalEmployees || 0} hint={`${dashboard.activeEmployees || 0} active this week`} />
        <StatCard label="Reports submitted" value={dashboard.totalReports || 0} hint={`${dashboard.todaySubmissions || 0} added today`} />
        <StatCard label="Hours reported" value={dashboard.totalHours || 0} hint={`${dashboard.photoCount || 0} photo uploads`} />
        <StatCard label="Needs action" value={dashboard.attentionNeeded || 0} hint={`${dashboard.syncFailures || 0} Sheets sync failures`} />
      </section>
      <AdminReportsView
        reports={reports.slice(0, 6)}
        title="Latest company reports"
        subtitle="Recent employee submissions shown in the same format as the reports section."
      />
    </>
  )
}

function ReportDetailsView({ report }) {
  if (!report) {
    return (
      <section className="glass-card section-card">
        <div className="section-head">
          <div>
            <div className="eyebrow">Report details</div>
            <h3>Report not found</h3>
          </div>
        </div>
        <p className="muted">Try selecting a different week or go back to the reports list.</p>
        <div style={{ marginTop: 16 }}>
          <Link className="secondary-button" to="/dashboard/admin/reports">
            Back to reports
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="glass-card section-card">
      <div className="section-head">
        <div>
          <div className="eyebrow">Report details</div>
          <h3>{report.siteName}</h3>
          <p className="muted">
            {new Date(report.workDate).toLocaleDateString()} | {report.shift} | {report.hoursWorked} hrs
          </p>
        </div>
        <Link className="secondary-button" to="/dashboard/admin/reports">
          Back to reports
        </Link>
      </div>

      <div className="content-grid" style={{ alignItems: 'start' }}>
        <section className="glass-card section-card">
          <div className="section-head">
            <div>
              <div className="eyebrow">Employee</div>
              <h3>{report.user?.name || 'Unknown employee'}</h3>
            </div>
          </div>
          <p><strong>Email:</strong> {report.user?.email || '-'}</p>
          <p><strong>Employee code:</strong> {report.user?.employeeCode || '-'}</p>
          <p><strong>Department:</strong> {report.user?.department || '-'}</p>
          <p><strong>Status:</strong> <span className={`status-pill status-${report.status}`}>{report.status.replace('-', ' ')}</span></p>
        </section>

        <section className="glass-card section-card">
          <div className="section-head">
            <div>
              <div className="eyebrow">Work summary</div>
              <h3>Field update</h3>
            </div>
          </div>
          {report.machineName ? <p><strong>Machine:</strong> {report.machineName}</p> : null}
          {report.clientName ? <p><strong>Client:</strong> {report.clientName}</p> : null}
          <p><strong>Work:</strong> {report.workSummary}</p>
          {report.problemsObserved ? <p><strong>Problems:</strong> {report.problemsObserved}</p> : null}
          {report.materialsUsed ? <p><strong>Materials:</strong> {report.materialsUsed}</p> : null}
          <p><strong>Sheets sync:</strong> {report.sheetsSync?.status || 'pending'}</p>
        </section>
      </div>

      {report.photos?.length ? (
        <section className="glass-card section-card">
          <div className="section-head">
            <div>
              <div className="eyebrow">Attachments</div>
              <h3>Photos</h3>
            </div>
          </div>
          <div className="report-photos">
            {normalizeReportPhotos(report.photos).map((photo) => (
              <a href={`${MEDIA_ORIGIN}${photo.url}`} key={photo.url} rel="noreferrer" target="_blank">
                <span className="photo-label">{photo.displayKind === 'before' ? 'Before work' : 'After work'}</span>
                <img alt={photo.originalName} src={`${MEDIA_ORIGIN}${photo.url}`} />
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  )
}

export default function ReportingPortal() {
  const navigate = useNavigate()
  const location = useLocation()
  const { reportId } = useParams()
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(null)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [weekStart, setWeekStart] = useState(getWeekStartValue())
  const [reports, setReports] = useState([])
  const [summary, setSummary] = useState({})
  const [dashboard, setDashboard] = useState({})
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyReportForm)
  const [userForm, setUserForm] = useState(emptyUserForm)
  const [authLoading, setAuthLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(Boolean(token))
  const [submitting, setSubmitting] = useState(false)
  const [userSaving, setUserSaving] = useState(false)

  const pageTitle = useMemo(() => (user?.role === 'admin' ? 'Admin Operations Hub' : 'Field Reporting Workspace'), [user])

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
        const [dashboardData, reportsData, usersData] = await Promise.all([
          apiRequest(`/admin/dashboard?weekStart=${weekStart}`, {}, token),
          apiRequest(`/admin/reports?weekStart=${weekStart}`, {}, token),
          apiRequest('/admin/users', {}, token),
        ])
        setDashboard(dashboardData.dashboard || {})
        setReports(reportsData.reports || [])
        setUsers(usersData.users || [])
      } else {
        const [summaryData, reportsData] = await Promise.all([
          apiRequest(`/reports/weekly-summary?weekStart=${weekStart}`, {}, token),
          apiRequest(`/reports/mine?weekStart=${weekStart}`, {}, token),
        ])
        setSummary(summaryData.summary || {})
        setReports(reportsData.reports || [])
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) refreshDashboard()
  }, [user, weekStart])

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
    setUsers([])
    setSummary({})
    setDashboard({})
    navigate('/login', { replace: true })
  }

  if (!token || !user) {
    return (
      <>
        <Toaster position="top-right" />
        <TopCornerActions
          onLoginClick={() => document.getElementById('login-email')?.focus()}
          onRegisterClick={() => toast('Please contact admin to create your TXTILPROS account.')}
          onSettingsClick={() => toast('Settings page coming soon.')}
          showAuthButtons
        />
        <LoginScreen credentials={credentials} loading={authLoading || pageLoading} onSubmit={handleLogin} setCredentials={setCredentials} />
        <Footer />
      </>
    )
  }

  const selectedReport = reports.find((report) => report._id === reportId)
  const adminSectionPath = reportId ? '/dashboard/admin/reports' : location.pathname

  return (
    <>
      <Toaster position="top-right" />
      <TopCornerActions
        onSettingsClick={() => toast('Settings page coming soon.')}
        showAuthButtons={false}
      />
      <main className="app-shell">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <section className="hero-panel">
          <DashboardHeader onLogout={handleLogout} refresh={refreshDashboard} setWeekStart={setWeekStart} user={user} weekStart={weekStart} />

          {user.role === 'admin' ? (
            <>
              <AdminNavigation activePath={adminSectionPath} />
              {location.pathname === '/dashboard/admin' ? <AdminOverview dashboard={dashboard} reports={reports} /> : null}
              {location.pathname === '/dashboard/admin/reports' ? <AdminReportsView reports={reports} /> : null}
              {location.pathname === '/dashboard/admin/employees' ? (
                <UserManagement form={userForm} setForm={setUserForm} saving={userSaving} onSubmit={handleUserSubmit} onToggle={handleUserToggle} users={users} />
              ) : null}
              {location.pathname.startsWith('/dashboard/admin/reports/') ? <ReportDetailsView report={selectedReport} /> : null}
            </>
          ) : (
            <>
              <section className="stat-grid">
                <StatCard label="Reports this week" value={summary.totalReports || 0} hint="Daily submissions captured" />
                <StatCard label="Hours logged" value={summary.totalHours || 0} hint="Total service effort recorded" />
                <StatCard label="Photos uploaded" value={summary.photoCount || 0} hint="Evidence attached to reports" />
                <StatCard label="Attention needed" value={summary.attentionNeeded || 0} hint="Blocked or support-needed jobs" />
              </section>
              <div className="content-grid">
                <ReportForm form={form} setForm={setForm} submitting={submitting} onSubmit={handleReportSubmit} />
                <ReportList reports={reports} showEmployee={false} title="Your weekly reports" />
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
