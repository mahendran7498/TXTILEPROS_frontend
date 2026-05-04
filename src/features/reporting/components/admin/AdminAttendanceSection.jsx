import { Fragment, useState } from 'react'
import AdminSectionIntro from './AdminSectionIntro'

const ATTENDANCE_WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function AttendanceDetails({ employee, monthLabel, totalDays }) {
  const firstDate = employee.attendance[0]?.date ? new Date(employee.attendance[0].date) : null
  const weekdayOffset = firstDate ? ((firstDate.getDay() + 6) % 7) : 0
  const leadingPlaceholders = Array.from({ length: weekdayOffset }, (_, index) => `placeholder-${index}`)

  return (
    <div className="attendance-details">
      <div className="section-head attendance-details-head">
        <div>
          <strong>{employee.name}</strong>
          <div className="muted">{employee.employeeCode || employee.email}</div>
          <div className="muted">{monthLabel || 'Selected month'} attendance</div>
        </div>
        <span className="muted">{employee.department || '-'}</span>
      </div>

      <div className="attendance-summary-badges">
        <span className="status-pill status-completed">Present: {employee.presentDays}</span>
        <span className="status-pill status-blocked">Absent: {employee.absentDays}</span>
        <span className="status-pill">{totalDays || employee.attendance.length} total days</span>
      </div>

      <div className="attendance-weekday-row">
        {ATTENDANCE_WEEKDAYS.map((day) => (
          <div className="attendance-weekday-cell" key={day}>
            {day}
          </div>
        ))}
      </div>

      <div className="attendance-month-grid">
        {leadingPlaceholders.map((placeholder) => (
          <div aria-hidden="true" className="attendance-day-placeholder" key={placeholder} />
        ))}
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

export default function AdminAttendanceSection({ attendance, attendanceMonth, setAttendanceMonth }) {
  const employees = Array.isArray(attendance?.employees) ? attendance.employees : []
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredEmployees = normalizedSearch
    ? employees.filter((employee) => {
        const name = String(employee.name || '').toLowerCase()
        const employeeCode = String(employee.employeeCode || '').toLowerCase()
        return name.includes(normalizedSearch) || employeeCode.includes(normalizedSearch)
      })
    : employees

  return (
    <>
      <AdminSectionIntro
        aside={
          <div className="admin-toolbar">
            <label className="admin-search-field" aria-label="Search employee">
              <span className="admin-control-label">Search employee</span>
              <input
                placeholder="Search by name or employee code"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>
            <div className="admin-toolbar-meta">
              <span className="status-pill status-completed">{attendance.totalDays || 0} days</span>
              <label className="admin-month-field" aria-label="Select attendance month">
                <span className="admin-control-label">Month</span>
                <input type="month" value={attendanceMonth} onChange={(event) => setAttendanceMonth(event.target.value)} />
              </label>
            </div>
          </div>
        }
        description="Attendance is generated automatically from submitted work reports for the selected month."
        eyebrow="Attendance"
        title={attendance.monthLabel || 'Monthly attendance summary'}
      />

      {filteredEmployees.length === 0 ? (
        <div className="empty-state">
          {employees.length === 0 ? 'No attendance data found for the selected month.' : 'No employees match your search.'}
        </div>
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
                {filteredEmployees.map((employee) => {
                  const isOpen = selectedEmployeeId === employee.id

                  return (
                    <Fragment key={employee.id}>
                      <tr>
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
                            <AttendanceDetails employee={employee} monthLabel={attendance.monthLabel} totalDays={attendance.totalDays} />
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
