import { Link } from 'react-router-dom'

export function StatCard({ label, value, hint }) {
  return (
    <article className="stat-card glass-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </article>
  )
}

export function TopCornerActions({ showAuthButtons, onLoginClick, onRegisterClick, onSettingsClick }) {
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

export function DashboardHeader({ user, weekStart, setWeekStart, refresh, onLogout }) {
  const isManagementUser = user.role === 'admin' || user.role === 'manager'
  const canOpenSalesModule = user.role === 'admin'

  return (
    <header className="dashboard-header">
      <div>
        <div className="eyebrow">Secure reporting workspace</div>
        <h2>{isManagementUser ? 'Management dashboard' : 'Employee dashboard'}</h2>
        <p className="muted">
          Signed in as {user.name} ({user.role}){user.department ? ` | ${user.department}` : ''}
        </p>
      </div>
      <div className="header-actions">
        <label className="field compact-field">
          <span>Week starting</span>
          <input type="date" value={weekStart} onChange={(event) => setWeekStart(event.target.value)} />
        </label>
        {canOpenSalesModule ? (
          <Link className="secondary-button" to="/sales/admin/orders">
            Sales Module
          </Link>
        ) : null}
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

export function ReportPhotoGrid({ photos }) {
  return (
    <div className="report-photos">
      {photos.map((photo) => (
        <a href={photo.href} key={photo.key} rel="noreferrer" target="_blank">
          <span className="photo-label">{photo.label}</span>
          <img alt={photo.alt} src={photo.href} />
        </a>
      ))}
    </div>
  )
}

export function AdminNavigation({ activePath, basePath, showMessages, showSalaries }) {
  const items = [
    { label: 'Overview', path: basePath },
    { label: 'Attendance', path: `${basePath}/attendance` },
    { label: 'Leaves', path: `${basePath}/leaves` },
    { label: 'Reports', path: `${basePath}/reports` },
    { label: 'Employees', path: `${basePath}/employees` },
  ]

  if (showSalaries) {
    items.splice(3, 0, { label: 'Salaries', path: `${basePath}/salaries` })
  }

  if (showMessages) {
    items.push({ label: 'Messages', path: `${basePath}/messages` })
  }

  return (
    <nav className="glass-card section-card admin-nav-shell">
      <div className="admin-nav-list">
        {items.map((item) => {
          const active = activePath === item.path
          return (
            <Link
              className={`admin-nav-link${active ? ' active' : ''}`}
              key={item.path}
              to={item.path}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
