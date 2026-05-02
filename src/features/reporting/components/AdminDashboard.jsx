import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPhotoSrc, normalizeReportPhotos } from '../utils'
import { AdminNavigation, ReportPhotoGrid, StatCard } from './SharedReportingUi'

function AdminSectionIntro({ eyebrow, title, description, aside }) {
  return (
    <section className="glass-card section-card admin-section-intro">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h3>{title}</h3>
        <p className="muted">{description}</p>
      </div>
      {aside ? <div className="admin-section-aside">{aside}</div> : null}
    </section>
  )
}

function AttendanceDetails({ employee }) {
  return (
    <div className="attendance-details">
      <div className="section-head attendance-details-head">
        <div>
          <strong>{employee.name}</strong>
          <div className="muted">{employee.employeeCode || employee.email}</div>
        </div>
        <span className="muted">{employee.department || '-'}</span>
      </div>

      <div className="attendance-summary-badges">
        <span className="status-pill status-completed">Present: {employee.presentDays}</span>
        <span className="status-pill status-blocked">Absent: {employee.absentDays}</span>
      </div>

      <div className="attendance-day-grid">
        {employee.attendance.map((day) => (
          <div className="attendance-day-card" key={`${employee.id}-${day.date}`}>
            <strong>{day.label}</strong>
            <span className={`status-pill status-${day.status === 'present' ? 'completed' : 'blocked'}`}>
              {day.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AttendanceOverview({ attendance }) {
  const employees = Array.isArray(attendance?.employees) ? attendance.employees : []
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')

  return (
    <>
      <AdminSectionIntro
        aside={<span className="status-pill status-completed">{employees.length} active employees</span>}
        description="Attendance is generated automatically from submitted work reports for the selected week."
        eyebrow="Attendance"
        title="Weekly attendance summary"
      />

      {employees.length === 0 ? (
        <div className="empty-state">No attendance data found for the selected week.</div>
      ) : (
        <section className="glass-card section-card admin-table-card">
          <div className="table-wrap admin-table-wrap">
            <table className="data-table admin-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Present Days</th>
                <th>Absent Days</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => {
                const isOpen = selectedEmployeeId === employee.id

                return (
                  <Fragment key={employee.id}>
                    <tr key={employee.id}>
                      <td>
                        <button
                          className="employee-name-button"
                          onClick={() => setSelectedEmployeeId(isOpen ? '' : employee.id)}
                          type="button"
                        >
                          {employee.name}
                        </button>
                        <div className="muted">{employee.employeeCode || employee.email}</div>
                      </td>
                      <td><span className="table-soft-text">{employee.department || '-'}</span></td>
                      <td><span className="status-pill status-completed">{employee.presentDays}</span></td>
                      <td><span className="status-pill status-blocked">{employee.absentDays}</span></td>
                    </tr>
                    {isOpen ? (
                      <tr className="attendance-expanded-row">
                        <td colSpan="4">
                          <AttendanceDetails employee={employee} />
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                )
              })}
            </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  )
}

function UserManagement({ users, form, setForm, saving, onSubmit, onToggle }) {
  return (
    <>
      <AdminSectionIntro
        aside={<span className="status-pill status-completed">{users.length} team members</span>}
        description="Create accounts, assign roles, and enable or disable employee access without leaving the dashboard."
        eyebrow="Access control"
        title="Manage employees"
      />

      <div className="admin-dual-grid">
        <section className="glass-card section-card admin-panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">New account</div>
              <h3>Create employee profile</h3>
            </div>
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
        </section>

        <section className="glass-card section-card admin-panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">Team roster</div>
              <h3>Employee directory</h3>
            </div>
          </div>

          <div className="table-wrap admin-table-wrap">
            <table className="data-table admin-table">
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
                    <td><span className="status-pill status-completed">{user.role}</span></td>
                    <td><span className="table-soft-text">{user.department || '-'}</span></td>
                    <td><span className="table-soft-text">{user.employeeCode || '-'}</span></td>
                    <td><span className={`status-pill status-${user.active ? 'completed' : 'blocked'}`}>{user.active ? 'Active' : 'Disabled'}</span></td>
                    <td><button className="ghost-button inline-button" onClick={() => onToggle(user)} type="button">{user.active ? 'Disable' : 'Enable'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}

function AdminReportsView({ reports, title = 'All employee submissions', subtitle = 'Review weekly work reports and open any report for full details.' }) {
  return (
    <section className="glass-card section-card admin-panel">
      <div className="section-head admin-section-head">
        <div>
          <div className="eyebrow">Reports</div>
          <h3>{title}</h3>
          <p className="muted">{subtitle}</p>
        </div>
        <div className="admin-inline-metrics">
          <span className="status-pill status-completed">{reports.length} entries</span>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="empty-state">No reports found for the selected week.</div>
      ) : (
        <div className="table-wrap admin-table-wrap">
          <table className="data-table admin-table">
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
                  <td>
                    <strong>{new Date(report.workDate).toLocaleDateString()}</strong>
                    <div className="muted">{report.shift}</div>
                  </td>
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
      <AdminSectionIntro
        aside={<span className="status-pill status-completed">{dashboard.activeEmployees || 0} active now</span>}
        description="Monitor weekly reporting activity, logged hours, and operational issues from one admin workspace."
        eyebrow="Overview"
        title="Operations snapshot"
      />
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

  const photos = normalizeReportPhotos(report.photos).map((photo, index) => ({
    key: photo.dataUrl || photo.url || index,
    href: getPhotoSrc(photo),
    alt: photo.originalName,
    label: photo.displayKind === 'before' ? 'Before work' : 'After work',
  }))

  return (
    <>
      <AdminSectionIntro
        aside={<span className={`status-pill status-${report.status}`}>{report.status.replace('-', ' ')}</span>}
        description="Review the employee, work summary, and photo evidence linked to this submission."
        eyebrow="Report details"
        title={report.siteName}
      />

      <section className="glass-card section-card admin-panel">
      <div className="section-head admin-section-head">
        <div>
          <p className="muted">
            {new Date(report.workDate).toLocaleDateString()} | {report.shift} | {report.hoursWorked} hrs
          </p>
        </div>
        <Link className="secondary-button" to="/dashboard/admin/reports">
          Back to reports
        </Link>
      </div>

      <div className="admin-detail-grid">
        <section className="glass-card section-card admin-panel">
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

        <section className="glass-card section-card admin-panel">
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

      {photos.length ? (
        <section className="glass-card section-card admin-panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">Attachments</div>
              <h3>Photos</h3>
            </div>
          </div>
          <ReportPhotoGrid photos={photos} />
        </section>
      ) : null}
    </section>
    </>
  )
}

export default function AdminDashboard({
  activePath,
  attendance,
  dashboard,
  locationPath,
  reportId,
  reports,
  selectedReport,
  userForm,
  setUserForm,
  userSaving,
  handleUserSubmit,
  handleUserToggle,
  users,
}) {
  return (
    <>
      <AdminNavigation activePath={activePath} />
      {locationPath === '/dashboard/admin' ? <AdminOverview dashboard={dashboard} reports={reports} /> : null}
      {locationPath === '/dashboard/admin/attendance' ? <AttendanceOverview attendance={attendance} /> : null}
      {locationPath === '/dashboard/admin/reports' ? <AdminReportsView reports={reports} /> : null}
      {locationPath === '/dashboard/admin/employees' ? (
        <UserManagement form={userForm} setForm={setUserForm} saving={userSaving} onSubmit={handleUserSubmit} onToggle={handleUserToggle} users={users} />
      ) : null}
      {locationPath.startsWith('/dashboard/admin/reports/') && reportId ? <ReportDetailsView report={selectedReport} /> : null}
    </>
  )
}
