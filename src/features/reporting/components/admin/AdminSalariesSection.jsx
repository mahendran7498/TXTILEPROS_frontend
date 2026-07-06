import { Fragment, useMemo, useState } from 'react'
import AdminPagination, { PAGE_SIZE } from './AdminPagination'
import AdminSectionIntro from './AdminSectionIntro'

const moneyFields = [
  ['basicSalary', 'Basic Salary'],
  ['incentives', 'Incentives'],
  ['overtimeAmount', 'Overtime Amount'],
  ['leaveDeduction', 'Leave Deduction'],
  ['otherDeductions', 'Other Deductions'],
]

function formatMoney(value) {
  return Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })
}

function getMonthLabel(record) {
  return new Date(record.year, Number(record.month || 1) - 1, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
}

function SalaryDetails({ auditLogs, editing, editForm, historyOpen, loadingHistory, onEditChange, onSave, record, saving }) {
  const employee = record.employee || {}

  return (
    <div className="salary-details">
      <div className="salary-detail-grid">
        <div className="salary-detail-panel">
          <div className="eyebrow">Employee Details</div>
          <p><strong>{employee.name || '-'}</strong></p>
          <p className="muted">{employee.employeeCode || employee.email || '-'}</p>
          <p className="muted">{employee.department || '-'}</p>
        </div>
        <div className="salary-detail-panel">
          <div className="eyebrow">Attendance Summary</div>
          <p>Present Days: <strong>{record.presentDays || 0}</strong></p>
          <p>Absent Days: <strong>{record.absentDays || 0}</strong></p>
          <p>Leave Details: <strong>{record.leaveDays || 0} day(s)</strong></p>
          <p>Overtime Hours: <strong>{record.overtimeHours || 0}</strong></p>
        </div>
        <div className="salary-detail-panel">
          <div className="eyebrow">Salary Breakdown</div>
          <p>Basic Salary: <strong>{formatMoney(record.basicSalary)}</strong></p>
          <p>Allowances: <strong>{formatMoney(record.allowances)}</strong></p>
          <p>Incentives: <strong>{formatMoney(record.incentives)}</strong></p>
          <p>Deductions: <strong>{formatMoney(Number(record.leaveDeduction || 0) + Number(record.otherDeductions || 0))}</strong></p>
          <p>Net Salary: <strong>{formatMoney(record.netSalary)}</strong></p>
        </div>
        <div className="salary-detail-panel">
          <div className="eyebrow">Delivery</div>
          <p>Generated Date: <strong>{record.generatedDate ? new Date(record.generatedDate).toLocaleString() : '-'}</strong></p>
          <p>Email Delivery Status: <strong>{record.emailDeliveryStatus || 'pending'}</strong></p>
          <p>Approval: <strong>{record.approvalStatus === 'approved' ? 'Approved' : 'Admin Review'}</strong></p>
          <p>Remarks: <strong>{record.remarks || '-'}</strong></p>
        </div>
      </div>

      {editing ? (
        <form className="salary-edit-form" onSubmit={(event) => onSave(event, record)}>
          {moneyFields.map(([field, label]) => (
            <label className="field" key={field}>
              <span>{label}</span>
              <input min="0" step="0.01" type="number" value={editForm[field] ?? ''} onChange={(event) => onEditChange(field, event.target.value)} />
            </label>
          ))}
          <label className="field">
            <span>Payment Status</span>
            <select value={editForm.paymentStatus || 'pending'} onChange={(event) => onEditChange('paymentStatus', event.target.value)}>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </label>
          <label className="field field-wide">
            <span>Remarks</span>
            <textarea rows="3" value={editForm.remarks || ''} onChange={(event) => onEditChange('remarks', event.target.value)} />
          </label>
          <button className="primary-button field-wide" disabled={saving} type="submit">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      ) : null}

      {historyOpen ? (
        <div className="salary-history">
          <div className="section-head">
            <div>
              <div className="eyebrow">Audit Log Table</div>
              <h4>salary_audit_logs</h4>
            </div>
          </div>
          {loadingHistory ? <div className="empty-state">Loading edit history...</div> : null}
          {!loadingHistory && !auditLogs.length ? <div className="empty-state">No edits recorded for this salary.</div> : null}
          {!loadingHistory && auditLogs.length ? (
            <div className="table-wrap admin-table-wrap">
              <table className="data-table admin-table salary-history-table">
                <thead>
                  <tr>
                    <th>Edited By</th>
                    <th>Field</th>
                    <th>Previous Value</th>
                    <th>New Value</th>
                    <th>Remarks</th>
                    <th>Edited At</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log._id}>
                      <td>{log.edited_by?.name || '-'}</td>
                      <td>{log.field_name}</td>
                      <td>{log.old_value || '-'}</td>
                      <td>{log.new_value || '-'}</td>
                      <td>{log.remarks || '-'}</td>
                      <td>{log.edited_at ? new Date(log.edited_at).toLocaleString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default function AdminSalariesSection({
  auditLogsBySalary,
  editForm,
  historyLoadingId,
  onApprove,
  onDownloadPdf,
  onEditChange,
  onGeneratePayslip,
  onLoadHistory,
  onResendEmail,
  onSave,
  salaryMonth,
  salaryStatus,
  salaries,
  savingSalaryId,
  setEditForm,
  setSalaryMonth,
  setSalaryStatus,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [openId, setOpenId] = useState('')
  const [editingId, setEditingId] = useState('')
  const [historyId, setHistoryId] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredSalaries = useMemo(() => {
    return salaries.filter((record) => {
      const employee = record.employee || {}
      const haystack = [
        employee.name,
        employee.employeeCode,
        employee.department,
        getMonthLabel(record),
        record.month,
        record.year,
      ].join(' ').toLowerCase()
      return !normalizedSearch || haystack.includes(normalizedSearch)
    })
  }, [normalizedSearch, salaries])

  const totalPages = Math.max(1, Math.ceil(filteredSalaries.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedSalaries = filteredSalaries.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE)

  function startEdit(record) {
    setOpenId(record._id)
    setEditingId(editingId === record._id ? '' : record._id)
    setEditForm({
      basicSalary: record.basicSalary || 0,
      incentives: record.incentives || 0,
      overtimeAmount: record.overtimeAmount || 0,
      leaveDeduction: record.leaveDeduction || 0,
      otherDeductions: record.otherDeductions || 0,
      paymentStatus: record.paymentStatus || 'pending',
      remarks: record.remarks || '',
    })
  }

  function toggleHistory(record) {
    const nextId = historyId === record._id ? '' : record._id
    setHistoryId(nextId)
    setOpenId(record._id)
    if (nextId) onLoadHistory(record._id)
  }

  return (
    <>
      <AdminSectionIntro
        aside={
          <div className="admin-toolbar salary-toolbar">
            <label className="admin-search-field">
              <span className="admin-control-label">Search</span>
              <input
                placeholder="Name, employee ID, department, month, year"
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value)
                  setCurrentPage(1)
                }}
              />
            </label>
            <div className="salary-filter-row">
              <label className="admin-month-field">
                <span className="admin-control-label">Month</span>
                <input
                  type="month"
                  value={salaryMonth}
                  onChange={(event) => {
                    setSalaryMonth(event.target.value)
                    setCurrentPage(1)
                  }}
                />
              </label>
              <label className="admin-search-field salary-status-field">
                <span className="admin-control-label">Status</span>
                <select
                  value={salaryStatus}
                  onChange={(event) => {
                    setSalaryStatus(event.target.value)
                    setCurrentPage(1)
                  }}
                >
                  <option value="">All</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="pending">Pending</option>
                </select>
              </label>
            </div>
          </div>
        }
        description="Attendance data flows into auto salary calculation, then admin review, edits, approval, PDF payslip generation, email delivery, and salary history."
        eyebrow="Salary Review"
        title="Admin Salary Dashboard"
      />

      {filteredSalaries.length === 0 ? (
        <div className="empty-state">No salary records match the selected filters.</div>
      ) : (
        <section className="glass-card section-card admin-table-card">
          <div className="table-wrap admin-table-wrap">
            <table className="data-table admin-table salary-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Month</th>
                  <th>Attendance</th>
                  <th>Net Salary</th>
                  <th>Payment</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSalaries.map((record) => {
                  const employee = record.employee || {}
                  const isOpen = openId === record._id
                  const isEditing = editingId === record._id
                  const historyOpen = historyId === record._id
                  const approved = record.approvalStatus === 'approved'

                  return (
                    <Fragment key={record._id}>
                      <tr>
                        <td>
                          <strong>{employee.name || '-'}</strong>
                          <div className="muted">{employee.employeeCode || employee.email || '-'}</div>
                          <div className="muted">{employee.department || '-'}</div>
                        </td>
                        <td>{getMonthLabel(record)}</td>
                        <td>
                          <span className="status-pill status-completed">{record.presentDays || 0} present</span>
                          <span className="status-pill status-blocked salary-mini-pill">{record.absentDays || 0} absent</span>
                        </td>
                        <td><strong>{formatMoney(record.netSalary)}</strong></td>
                        <td><span className={`status-pill status-${record.paymentStatus || 'pending'}`}>{record.paymentStatus || 'pending'}</span></td>
                        <td><span className={`status-pill status-${record.emailDeliveryStatus === 'failed' ? 'blocked' : 'pending'}`}>{record.emailDeliveryStatus || 'pending'}</span></td>
                        <td>
                          <div className="salary-action-row">
                            <button className="secondary-button inline-button" type="button" onClick={() => setOpenId(isOpen ? '' : record._id)}>View Salary</button>
                            <button className="ghost-button inline-button" disabled={approved} type="button" onClick={() => startEdit(record)}>Edit Salary</button>
                            <button className="primary-button inline-button" disabled={approved} type="button" onClick={() => onApprove(record)}>Approve Salary</button>
                            <button className="secondary-button inline-button" type="button" onClick={() => onGeneratePayslip(record)}>Generate Payslip</button>
                            <button className="ghost-button inline-button" type="button" onClick={() => onResendEmail(record)}>Resend Email</button>
                            <button className="secondary-button inline-button" type="button" onClick={() => onDownloadPdf(record)}>Download PDF</button>
                            <button className="ghost-button inline-button" type="button" onClick={() => toggleHistory(record)}>View Edit History</button>
                          </div>
                        </td>
                      </tr>
                      {isOpen ? (
                        <tr className="attendance-expanded-row">
                          <td colSpan="7">
                            <SalaryDetails
                              auditLogs={auditLogsBySalary[record._id] || []}
                              editing={isEditing}
                              editForm={editForm}
                              historyOpen={historyOpen}
                              loadingHistory={historyLoadingId === record._id}
                              onEditChange={onEditChange}
                              onSave={onSave}
                              record={record}
                              saving={savingSalaryId === record._id}
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
          <AdminPagination currentPage={safeCurrentPage} itemLabel="salary records" onPageChange={setCurrentPage} totalItems={filteredSalaries.length} />
        </section>
      )}
    </>
  )
}
