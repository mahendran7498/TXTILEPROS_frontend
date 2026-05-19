import { Fragment, useState } from 'react'
import AdminPagination, { PAGE_SIZE } from './AdminPagination'
import AdminSectionIntro from './AdminSectionIntro'

const ATTENDANCE_WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getAttendanceStatusClass(status) {
  if (status === 'present') return 'completed'
  if (status === 'leave') return 'leave'
  if (status === 'holiday') return 'holiday'
  if (status === 'comp-off') return 'comp-off'
  return 'blocked'
}

function formatHolidayList(holidays = []) {
  return holidays.map((holiday) => {
    const date = new Date(`${holiday.date}T00:00:00`)
    return `${date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} - ${holiday.name}`
  })
}

function getMonthStartDate(attendanceMonth, employee) {
  if (attendanceMonth) {
    return new Date(`${attendanceMonth}-01T00:00:00`)
  }

  if (employee.attendance[0]?.date) {
    return new Date(`${employee.attendance[0].date}T00:00:00`)
  }

  return null
}

function AttendanceDetails({ attendanceMonth, employee, monthLabel, totalDays }) {
  const firstDate = getMonthStartDate(attendanceMonth, employee)
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
        <span className="status-pill status-leave">Leave: {employee.leaveDays || 0}</span>
        <span className="status-pill status-comp-off">Comp-off: {employee.compOffDays || 0}</span>
        <span className="status-pill status-pending">Paid leave balance: {employee.paidLeaveRemaining ?? employee.paidLeaveLimit ?? 15}</span>
        <span className="status-pill status-holiday">Holiday: {employee.holidayDays || 0}</span>
        <span className="status-pill status-blocked">Absent: {employee.absentDays}</span>
        <span className="status-pill">Paid leave used: {employee.paidLeaveUsed ?? employee.paidLeaveDays ?? 0}</span>
        <span className="status-pill">{totalDays || employee.attendance.length} total days</span>
      </div>

      <div className="attendance-calendar-shell">
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
              <span className={`status-pill status-${getAttendanceStatusClass(day.status)}`}>
                {day.status}
              </span>
              {day.holidayName ? <div className="attendance-day-note">{day.holidayName}</div> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AdminAttendanceSection({ attendance, attendanceMonth, setAttendanceMonth }) {
  const employees = Array.isArray(attendance?.employees) ? attendance.employees : []
  const holidayList = formatHolidayList(attendance?.holidays || [])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredEmployees = normalizedSearch
    ? employees.filter((employee) => {
        const name = String(employee.name || '').toLowerCase()
        const employeeCode = String(employee.employeeCode || '').toLowerCase()
        return name.includes(normalizedSearch) || employeeCode.includes(normalizedSearch)
      })
    : employees
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedEmployees = filteredEmployees.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE)

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
                  onChange={(event) => {
                    setSearchTerm(event.target.value)
                    setCurrentPage(1)
                    setSelectedEmployeeId('')
                  }}
                />
              </label>
            <div className="admin-toolbar-meta">
              <span className="status-pill status-completed">{attendance.totalDays || 0} days</span>
              <label className="admin-month-field" aria-label="Select attendance month">
                <span className="admin-control-label">Month</span>
                <input
                  type="month"
                  value={attendanceMonth}
                  onChange={(event) => {
                    setAttendanceMonth(event.target.value)
                    setCurrentPage(1)
                    setSelectedEmployeeId('')
                  }}
                />
              </label>
            </div>
          </div>
        }
        description={`Attendance is generated automatically from submitted work reports for the selected month. Paid leave is capped at ${attendance?.paidLeaveLimit || 15} days per year.`}
        eyebrow="Attendance"
        title={attendance.monthLabel || 'Monthly attendance summary'}
      />

      {holidayList.length ? (
        <section className="glass-card section-card admin-panel">
          <div className="section-head admin-section-head">
            <div>
              <div className="eyebrow">Government holidays</div>
              <h3>{attendance.monthLabel || 'Selected month'} holiday calendar</h3>
              <p className="muted">These holidays are counted in the holiday column and shown inside each employee calendar.</p>
            </div>
          </div>
          <div className="attendance-holiday-list">
            {holidayList.map((holiday) => (
              <span className="status-pill status-holiday" key={holiday}>{holiday}</span>
            ))}
          </div>
        </section>
      ) : null}

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
                  <th>Leave Days</th>
                  <th>Paid Leave</th>
                  <th>Holiday Days</th>
                  <th>Absent Days</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((employee) => {
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
                        <td><span className="status-pill status-leave">{employee.leaveDays || 0}</span></td>
                        <td><span className="status-pill status-pending">{employee.paidLeaveRemaining ?? employee.paidLeaveLimit ?? 15}</span></td>
                        <td><span className="status-pill status-holiday">{employee.holidayDays || 0}</span></td>
                        <td><span className="status-pill status-blocked">{employee.absentDays}</span></td>
                      </tr>
                      {isOpen ? (
                        <tr className="attendance-expanded-row">
                          <td colSpan="7">
                            <AttendanceDetails
                              attendanceMonth={attendanceMonth}
                              employee={employee}
                              monthLabel={attendance.monthLabel}
                              totalDays={attendance.totalDays}
                            />
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
          <AdminPagination
            currentPage={safeCurrentPage}
            itemLabel="employees"
            onPageChange={setCurrentPage}
            totalItems={filteredEmployees.length}
          />
        </section>
      )}
    </>
  )
}
