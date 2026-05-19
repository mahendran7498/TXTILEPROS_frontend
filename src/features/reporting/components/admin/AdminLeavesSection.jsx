import { useMemo, useState } from 'react'
import AdminPagination, { PAGE_SIZE } from './AdminPagination'
import AdminSectionIntro from './AdminSectionIntro'

function formatLeaveRange(leave) {
  const startValue = leave.fromDate || leave.leaveDate
  const endValue = leave.toDate || leave.leaveDate || leave.fromDate

  if (!startValue) return 'Date not available'

  const start = new Date(startValue).toLocaleDateString()
  const end = endValue ? new Date(endValue).toLocaleDateString() : start
  return start === end ? start : `${start} - ${end}`
}

function LeaveActionForm({ leave, loading, onDecision }) {
  const [comment, setComment] = useState(leave.adminComment || '')

  return (
    <div className="leave-action-box">
      <label className="field">
        <span>Admin note</span>
        <textarea
          rows="3"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Optional reason for approval or rejection"
        />
      </label>
      <div className="leave-action-buttons">
        <button className="primary-button inline-button" disabled={loading} type="button" onClick={() => onDecision(leave._id, 'approved', comment)}>
          {loading ? 'Saving...' : 'Approve'}
        </button>
        <button className="ghost-button inline-button" disabled={loading} type="button" onClick={() => onDecision(leave._id, 'rejected', comment)}>
          {loading ? 'Saving...' : 'Reject'}
        </button>
      </div>
    </div>
  )
}

export default function AdminLeavesSection({ leaves, leaveActionLoadingId, onDecision }) {
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredLeaves = useMemo(() => {
    if (statusFilter === 'all') return leaves
    return leaves.filter((leave) => leave.status === statusFilter)
  }, [leaves, statusFilter])
  const totalPages = Math.max(1, Math.ceil(filteredLeaves.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedLeaves = filteredLeaves.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE)

  const pendingCount = leaves.filter((leave) => leave.status === 'pending').length

  return (
    <>
      <AdminSectionIntro
        aside={<span className="status-pill status-needs-support">{pendingCount} pending requests</span>}
        description="Review leave applications from employees, approve or reject them, and track the 15-day yearly paid leave balance before confirming approval."
        eyebrow="Leave control"
        title="Manage leave requests"
      />

      <section className="glass-card section-card admin-panel">
        <div className="section-head admin-section-head">
          <div>
            <div className="eyebrow">Queue</div>
            <h3>Leave approval desk</h3>
            <p className="muted">Pending requests stay at the top so admin can make quick decisions.</p>
          </div>
          <div className="admin-toolbar admin-toolbar-compact">
            <label className="admin-search-field">
              <span className="admin-control-label">Filter status</span>
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="all">All requests</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
            <div className="admin-toolbar-meta">
              <span className="status-pill status-completed">{filteredLeaves.length} requests</span>
            </div>
          </div>
        </div>

        {filteredLeaves.length === 0 ? (
          <div className="empty-state">No leave requests found for this filter.</div>
        ) : (
          <div className="leave-admin-list">
            {paginatedLeaves.map((leave) => {
              const isLoading = leaveActionLoadingId === leave._id

              return (
                <article className="leave-admin-card" key={leave._id}>
                  <div className="report-topline">
                    <div>
                      <h4>{leave.user?.name || 'Unknown employee'}</h4>
                      <p className="muted">
                        {leave.user?.employeeCode || leave.user?.email || '-'} | {leave.user?.department || 'Department not set'}
                      </p>
                    </div>
                    <span className={`status-pill status-${leave.status}`}>{leave.status}</span>
                  </div>

                  <div className="leave-admin-meta">
                    <span><strong>Leave dates:</strong> {formatLeaveRange(leave)}</span>
                    <span><strong>Applied:</strong> {new Date(leave.createdAt).toLocaleDateString()}</span>
                    <span><strong>Working paid days:</strong> {leave.requestedPaidLeaveDays || 0}</span>
                    <span><strong>Remaining paid leaves:</strong> {leave.remainingPaidLeaves ?? leave.paidLeaveLimit ?? 15}</span>
                  </div>

                  <p><strong>Reason:</strong> {leave.reason}</p>

                  {leave.status === 'pending' ? (
                    <LeaveActionForm leave={leave} loading={isLoading} onDecision={onDecision} />
                  ) : (
                    <div className="leave-decision-note">
                      <p className="muted">
                        Reviewed by {leave.reviewedBy?.name || 'Admin'} on {leave.reviewedAt ? new Date(leave.reviewedAt).toLocaleDateString() : 'N/A'}
                      </p>
                      {leave.status === 'approved' ? (
                        <p><strong>Paid leave counted:</strong> {leave.paidLeaveDays || 0} of {leave.paidLeaveLimit || 15}</p>
                      ) : null}
                      {leave.status === 'approved' ? (
                        <p><strong>Remaining paid leaves:</strong> {leave.remainingPaidLeaves ?? 0}</p>
                      ) : null}
                      {leave.adminComment ? <p><strong>Admin note:</strong> {leave.adminComment}</p> : null}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
        <AdminPagination
          currentPage={safeCurrentPage}
          itemLabel="leave requests"
          onPageChange={setCurrentPage}
          totalItems={filteredLeaves.length}
        />
      </section>
    </>
  )
}
