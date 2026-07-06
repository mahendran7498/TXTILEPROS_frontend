import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { MAX_BEFORE_WORK_PHOTOS, MAX_REPORT_PHOTO_SIZE_BYTES } from '../constants'
import { getLocalDateInputValue } from '../utils'
import { getPhotoSrc, normalizeReportPhotos, readMultipleFiles, readSingleFile } from '../utils'
import { ReportPhotoGrid, StatCard } from './SharedReportingUi'

const REPORT_PHOTO_LIMIT_MB = Math.floor(MAX_REPORT_PHOTO_SIZE_BYTES / (1024 * 1024))
const REPORT_EDIT_WINDOW_MS = 60 * 60 * 1000

function EmployeeSectionIntro({ eyebrow, title, description, aside }) {
  return (
    <section className="glass-card section-card employee-section-intro">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h3>{title}</h3>
        <p className="muted">{description}</p>
      </div>
      {aside ? <div className="employee-section-aside">{aside}</div> : null}
    </section>
  )
}

function formatLeaveRange(leave) {
  const startValue = leave.fromDate || leave.leaveDate
  const endValue = leave.toDate || leave.leaveDate || leave.fromDate

  if (!startValue) return 'Date not available'

  const start = new Date(startValue).toLocaleDateString()
  const end = endValue ? new Date(endValue).toLocaleDateString() : start
  return start === end ? start : `${start} - ${end}`
}

function getRemainingEditMinutes(report, nowMs) {
  const elapsedMs = nowMs - new Date(report.createdAt).getTime()
  const remainingMs = Math.max(REPORT_EDIT_WINDOW_MS - elapsedMs, 0)
  return Math.ceil(remainingMs / (60 * 1000))
}

function ReportList({ onEditReport, reports, showEmployee, title }) {
  const [nowMs] = useState(() => Date.now())

  return (
    <section className="glass-card section-card employee-panel">
      <div className="section-head employee-section-head">
        <div>
          <div className="eyebrow">Report stream</div>
          <h3>{title}</h3>
          <p className="muted">Review your latest submissions, uploaded photos, and work notes for the selected week.</p>
        </div>
        <div className="employee-inline-metrics">
          <span className="status-pill status-completed">{reports.length} reports</span>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="empty-state">No reports found for the selected week.</div>
      ) : (
        <div className="report-list">
          {reports.map((report) => {
            const photos = normalizeReportPhotos(report.photos).map((photo, index) => ({
              key: photo.dataUrl || photo.url || index,
              href: getPhotoSrc(photo),
              alt: photo.originalName,
              label: photo.displayKind === 'before' ? 'Before work' : 'After work',
            }))
            const elapsedMs = nowMs - new Date(report.createdAt).getTime()
            const canEdit = elapsedMs <= REPORT_EDIT_WINDOW_MS
            const remainingEditMinutes = getRemainingEditMinutes(report, nowMs)

            return (
              <article className="report-card employee-report-card" key={report._id}>
                <div className="report-topline">
                  <div>
                    <h4>{report.siteName}</h4>
                    <p className="muted">
                      {new Date(report.workDate).toLocaleDateString()} | {report.shift} | {report.hoursWorked} hrs
                    </p>
                  </div>
                  <span className={`status-pill status-${report.status}`}>{report.status.replace('-', ' ')}</span>
                </div>
                {canEdit ? (
                  <div className="report-footer">
                    <span>Edit available for {remainingEditMinutes} more min</span>
                    <button className="ghost-button inline-button" onClick={() => onEditReport(report)} type="button">Edit report</button>
                  </div>
                ) : null}

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

                {photos.length ? <ReportPhotoGrid photos={photos} /> : null}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

function ReportForm({ editingReportId, form, onCancelEdit, setForm, submitting, onSubmit }) {
  async function handleFileChange(event, kind) {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    try {
      if (kind === 'before') {
        if (files.length > MAX_BEFORE_WORK_PHOTOS) {
          toast.error(`You can select up to ${MAX_BEFORE_WORK_PHOTOS} before-work photos.`)
        }

        const photos = await readMultipleFiles(files.slice(0, MAX_BEFORE_WORK_PHOTOS), kind)
        setForm((current) => ({
          ...current,
          photos: {
            ...current.photos,
            before: photos,
          },
        }))
        return
      }

      const photo = await readSingleFile(files[0], kind)
      setForm((current) => ({
        ...current,
        photos: {
          ...current.photos,
          [kind]: photo,
        },
      }))
    } catch (error) {
      toast.error(error.message)
    } finally {
      event.target.value = ''
    }
  }

  return (
    <section className="glass-card section-card employee-panel">
      <div className="section-head employee-section-head">
        <div>
          <div className="eyebrow">Daily update</div>
          <h3>{editingReportId ? 'Edit work report' : 'Submit work report'}</h3>
          <p className="muted">
            {editingReportId
              ? 'Update your submitted report. Edits are allowed only within 1 hour of submission.'
              : 'Capture work done, machine status, materials used, and before-after photo proof from the field.'}
          </p>
        </div>
        {editingReportId ? <button className="ghost-button inline-button" onClick={onCancelEdit} type="button">Cancel edit</button> : null}
      </div>

      <form className="report-grid employee-form-grid" onSubmit={onSubmit}>
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
          <span>Before work photos</span>
          <input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={(event) => handleFileChange(event, 'before')} />
          <small>Upload up to {MAX_BEFORE_WORK_PHOTOS} machine/site photos before starting work. Max {REPORT_PHOTO_LIMIT_MB}MB each.</small>
        </label>
        <label className="field">
          <span>After work photo</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleFileChange(event, 'after')} />
          <small>Upload the final condition after the job is finished. Max {REPORT_PHOTO_LIMIT_MB}MB.</small>
        </label>

        <div className="field-wide photo-preview-grid">
          {!form.photos.before.length && !form.photos.after ? <div className="empty-state small-empty">Before and after photo previews will appear here.</div> : null}
          {[...form.photos.before, form.photos.after].filter(Boolean).map((photo, index) => (
            <div className="photo-chip" key={`${photo.kind}-${photo.name || photo.originalName || index}-${index}`}>
              <span className="photo-label photo-chip-label">{photo.kind === 'before' ? `Before work ${index + 1}` : 'After work'}</span>
              <img alt={photo.name || photo.originalName || 'Report photo'} src={getPhotoSrc(photo)} />
              <span>{photo.name || photo.originalName || 'Uploaded photo'}</span>
            </div>
          ))}
        </div>

        <button className="primary-button field-wide" disabled={submitting} type="submit">
          {submitting ? (editingReportId ? 'Updating report...' : 'Submitting report...') : (editingReportId ? 'Update work report' : 'Save work report')}
        </button>
      </form>
    </section>
  )
}

function LeaveForm({ leaveForm, setLeaveForm, leaveSubmitting, onSubmit }) {
  const minLeaveDate = getLocalDateInputValue()

  return (
    <section className="glass-card section-card employee-panel">
      <div className="section-head employee-section-head">
        <div>
          <div className="eyebrow">Leave request</div>
          <h3>Apply for leave</h3>
          <p className="muted">Choose your leave dates in advance. Approved working-day leave is counted against the 15 paid leave days available each year.</p>
        </div>
      </div>

      <form className="report-grid employee-form-grid" onSubmit={onSubmit}>
        <label className="field">
          <span>From date</span>
          <input required min={minLeaveDate} type="date" value={leaveForm.fromDate} onChange={(event) => setLeaveForm((current) => ({ ...current, fromDate: event.target.value }))} />
        </label>
        <label className="field">
          <span>To date</span>
          <input required type="date" min={leaveForm.fromDate || minLeaveDate} value={leaveForm.toDate} onChange={(event) => setLeaveForm((current) => ({ ...current, toDate: event.target.value }))} />
        </label>
        <label className="field field-wide">
          <span>Reason</span>
          <textarea
            required
            rows="5"
            value={leaveForm.reason}
            onChange={(event) => setLeaveForm((current) => ({ ...current, reason: event.target.value }))}
            placeholder="Explain why you need leave"
          />
        </label>
        <button className="primary-button field-wide" disabled={leaveSubmitting} type="submit">
          {leaveSubmitting ? 'Submitting leave...' : 'Submit leave request'}
        </button>
      </form>
    </section>
  )
}

function LeaveList({ leaves }) {
  return (
    <section className="glass-card section-card employee-panel">
      <div className="section-head employee-section-head">
        <div>
          <div className="eyebrow">Leave tracker</div>
          <h3>Your leave requests</h3>
          <p className="muted">Track whether admin has approved, rejected, or is still reviewing your request.</p>
        </div>
        <div className="employee-inline-metrics">
          <span className="status-pill status-completed">{leaves.length} requests</span>
        </div>
      </div>

      {leaves.length === 0 ? (
        <div className="empty-state">No leave requests submitted yet.</div>
      ) : (
        <div className="leave-list">
          {leaves.map((leave) => (
            <article className="leave-card" key={leave._id}>
              <div className="report-topline">
                <div>
                  <h4>{formatLeaveRange(leave)}</h4>
                  <p className="muted">Applied on {new Date(leave.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`status-pill status-${leave.status}`}>{leave.status}</span>
              </div>
              <p><strong>Reason:</strong> {leave.reason}</p>
              {leave.status === 'approved' ? <p><strong>Paid leave counted:</strong> {leave.paidLeaveDays || 0} day(s)</p> : null}
              {leave.status === 'approved' ? <p><strong>Remaining paid leaves:</strong> {leave.remainingPaidLeaves ?? 0}</p> : null}
              {leave.adminComment ? <p><strong>Admin note:</strong> {leave.adminComment}</p> : null}
              {leave.reviewedAt ? (
                <div className="report-footer">
                  <span>Reviewed by {leave.reviewedBy?.name || 'Admin'}</span>
                  <span>{new Date(leave.reviewedAt).toLocaleDateString()}</span>
                </div>
              ) : (
                <div className="report-footer">
                  <span>Waiting for admin decision</span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function formatSalaryMonth(salary) {
  return new Date(salary.year, Number(salary.month || 1) - 1, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
}

function PayslipList({ salaries, onDownload }) {
  return (
    <section className="glass-card section-card employee-panel">
      <div className="section-head employee-section-head">
        <div>
          <div className="eyebrow">Payslips</div>
          <h3>Your approved payslips</h3>
          <p className="muted">Download salary PDFs after admin approval and payslip generation.</p>
        </div>
        <div className="employee-inline-metrics">
          <span className="status-pill status-completed">{salaries.length} payslips</span>
        </div>
      </div>

      {salaries.length === 0 ? (
        <div className="empty-state">No approved payslips available yet.</div>
      ) : (
        <div className="leave-list">
          {salaries.map((salary) => (
            <article className="leave-card" key={salary._id}>
              <div className="report-topline">
                <div>
                  <h4>{formatSalaryMonth(salary)}</h4>
                  <p className="muted">Generated {salary.generatedDate ? new Date(salary.generatedDate).toLocaleDateString() : '-'}</p>
                </div>
                <span className={`status-pill status-${salary.paymentStatus || 'pending'}`}>{salary.paymentStatus || 'pending'}</span>
              </div>
              <p><strong>Present Days:</strong> {salary.presentDays || 0}</p>
              <p><strong>Absent Days:</strong> {salary.absentDays || 0}</p>
              <p><strong>Net Salary:</strong> {Number(salary.netSalary || 0).toLocaleString('en-IN')}</p>
              <div className="report-footer">
                <span>Email: {salary.emailDeliveryStatus || 'pending'}</span>
                <button className="secondary-button inline-button" type="button" onClick={() => onDownload(salary)}>
                  Download PDF
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default function EmployeeDashboard({
  editingReportId,
  summary,
  reports,
  leaves,
  salaries,
  form,
  leaveForm,
  onCancelReportEdit,
  onEditReport,
  setForm,
  setLeaveForm,
  submitting,
  leaveSubmitting,
  onSubmit,
  onLeaveSubmit,
  onPayslipDownload,
}) {
  const [activeSection, setActiveSection] = useState('reports')
  const attendance = summary.attendance || {}
  const pendingLeaves = leaves.filter((leave) => leave.status === 'pending').length
  const approvedLeaves = leaves.filter((leave) => leave.status === 'approved').length
  const rejectedLeaves = leaves.filter((leave) => leave.status === 'rejected').length
  const todayAttendanceLabel = attendance.todayStatus === 'holiday'
    ? 'Holiday today'
    : attendance.todayStatus === 'comp-off'
      ? 'Comp-off today'
    : attendance.todayStatus === 'present'
      ? 'Present today'
      : 'Awaiting report today'

  return (
    <>
      <EmployeeSectionIntro
        aside={<span className="status-pill status-completed">{todayAttendanceLabel}</span>}
        description="Submit field activity, apply for leave, and track both your work updates and admin decisions in one place."
        eyebrow="Workspace"
        title="Your reporting dashboard"
      />
      <section className="stat-grid">
        <StatCard label="Reports this week" value={summary.totalReports || 0} hint="Daily submissions captured" />
        <StatCard label="Hours logged" value={summary.totalHours || 0} hint="Total service effort recorded" />
        <StatCard label="Present days" value={attendance.presentDays || 0} hint={todayAttendanceLabel} />
        <StatCard label="Absent days" value={attendance.absentDays || 0} hint={`${summary.attentionNeeded || 0} blocked or support-needed jobs`} />
        <StatCard label="Pending leaves" value={pendingLeaves} hint={`${approvedLeaves} approved requests`} />
        <StatCard label="Rejected leaves" value={rejectedLeaves} hint="Requests not approved yet" />
      </section>

      <nav className="glass-card section-card employee-subnav-shell">
        <div className="employee-subnav-list">
          <button
            className={`employee-subnav-link${activeSection === 'reports' ? ' active' : ''}`}
            onClick={() => setActiveSection('reports')}
            type="button"
          >
            Reports
          </button>
          <button
            className={`employee-subnav-link${activeSection === 'leave' ? ' active' : ''}`}
            onClick={() => setActiveSection('leave')}
            type="button"
          >
            Leave
          </button>
          <button
            className={`employee-subnav-link${activeSection === 'payslips' ? ' active' : ''}`}
            onClick={() => setActiveSection('payslips')}
            type="button"
          >
            Payslips
          </button>
        </div>
      </nav>

      {activeSection === 'reports' ? (
        <div className="employee-dashboard-grid">
          <ReportForm editingReportId={editingReportId} form={form} onCancelEdit={onCancelReportEdit} setForm={setForm} submitting={submitting} onSubmit={onSubmit} />
          <ReportList onEditReport={onEditReport} reports={reports} showEmployee={false} title="Your weekly reports" />
        </div>
      ) : null}

      {activeSection === 'leave' ? (
        <div className="employee-dashboard-grid">
          <LeaveForm leaveForm={leaveForm} leaveSubmitting={leaveSubmitting} onSubmit={onLeaveSubmit} setLeaveForm={setLeaveForm} />
          <LeaveList leaves={leaves} />
        </div>
      ) : null}

      {activeSection === 'payslips' ? <PayslipList salaries={salaries} onDownload={onPayslipDownload} /> : null}
    </>
  )
}
