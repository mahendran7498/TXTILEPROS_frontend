import { toast } from 'react-hot-toast'
import { getPhotoSrc, normalizeReportPhotos, readSingleFile } from '../utils'
import { ReportPhotoGrid, StatCard } from './SharedReportingUi'

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

function ReportList({ reports, showEmployee, title }) {
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
    <section className="glass-card section-card employee-panel">
      <div className="section-head employee-section-head">
        <div>
          <div className="eyebrow">Daily update</div>
          <h3>Submit work report</h3>
          <p className="muted">Capture work done, machine status, materials used, and before-after photo proof from the field.</p>
        </div>
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

export default function EmployeeDashboard({ summary, reports, form, setForm, submitting, onSubmit }) {
  const attendance = summary.attendance || {}

  return (
    <>
      <EmployeeSectionIntro
        aside={<span className="status-pill status-completed">{attendance.todayStatus === 'present' ? 'Present today' : 'Awaiting report today'}</span>}
        description="Submit field activity, track your weekly work log, and keep photo-backed service updates in one place."
        eyebrow="Workspace"
        title="Your reporting dashboard"
      />
      <section className="stat-grid">
        <StatCard label="Reports this week" value={summary.totalReports || 0} hint="Daily submissions captured" />
        <StatCard label="Hours logged" value={summary.totalHours || 0} hint="Total service effort recorded" />
        <StatCard label="Present days" value={attendance.presentDays || 0} hint={`${attendance.todayStatus === 'present' ? 'Present' : 'Absent'} today`} />
        <StatCard label="Absent days" value={attendance.absentDays || 0} hint={`${summary.attentionNeeded || 0} blocked or support-needed jobs`} />
      </section>
      <div className="employee-dashboard-grid">
        <ReportForm form={form} setForm={setForm} submitting={submitting} onSubmit={onSubmit} />
        <ReportList reports={reports} showEmployee={false} title="Your weekly reports" />
      </div>
    </>
  )
}
