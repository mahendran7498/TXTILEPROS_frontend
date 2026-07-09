import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminPagination, { PAGE_SIZE } from './AdminPagination'

export default function AdminReportsSection({ basePath, reports, title = 'All employee submissions', subtitle = 'Review weekly work reports and open any report for full details.' }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredReports = normalizedSearch
    ? reports.filter((report) => {
        const employeeName = String(report.user?.name || '').toLowerCase()
        const employeeCode = String(report.user?.employeeCode || '').toLowerCase()
        return employeeName.includes(normalizedSearch) || employeeCode.includes(normalizedSearch)
      })
    : reports
  const totalPages = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedReports = filteredReports.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE)

  return (
    <>
      <section className="glass-card section-card admin-panel">
        <div className="section-head admin-section-head">
          <div>
            <div className="eyebrow">Reports</div>
            <h3>{title}</h3>
            <p className="muted">{subtitle}</p>
          </div>
          <div className="admin-toolbar admin-toolbar-compact">
            <label className="admin-search-field" aria-label="Search report">
              <span className="admin-control-label">Search report</span>
              <input
                placeholder="Search by employee name or code"
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value)
                  setCurrentPage(1)
                }}
              />
            </label>
            <div className="admin-toolbar-meta">
              <span className="status-pill status-completed">{filteredReports.length} entries</span>
            </div>
          </div>
        </div>
      </section>

      {filteredReports.length === 0 ? (
        <div className="empty-state">
          {reports.length === 0 ? 'No reports found for the selected week.' : 'No reports match your search.'}
        </div>
      ) : (
        <section className="glass-card section-card admin-panel">
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
                {paginatedReports.map((report) => (
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
                      <Link className="ghost-button inline-button" to={`${basePath}/reports/${report._id}`}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination
            currentPage={safeCurrentPage}
            itemLabel="reports"
            onPageChange={setCurrentPage}
            totalItems={filteredReports.length}
          />
        </section>
      )}
    </>
  )
}
