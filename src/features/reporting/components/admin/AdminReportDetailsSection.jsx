import { Link } from 'react-router-dom'
import { getPhotoSrc, normalizeReportPhotos } from '../../utils'
import { ReportPhotoGrid } from '../SharedReportingUi'
import AdminSectionIntro from './AdminSectionIntro'

export default function AdminReportDetailsSection({ basePath, loading, report }) {
  if (loading) {
    if (report) {
      return (
        <>
          <AdminSectionIntro
            aside={<span className={`status-pill status-${report.status}`}>{report.status?.replace('-', ' ') || 'loading'}</span>}
            description="Basic report information is ready. Loading the full report details and attachments."
            eyebrow="Report details"
            title={report.siteName || 'Loading report...'}
          />

          <section className="glass-card section-card admin-panel">
            <p className="muted">Loading full report details and attached photos...</p>
          </section>
        </>
      )
    }

    return (
      <section className="glass-card section-card">
        <div className="section-head">
          <div>
            <div className="eyebrow">Report details</div>
            <h3>Loading report...</h3>
          </div>
        </div>
        <p className="muted">Fetching the full report, employee info, and attached photos.</p>
      </section>
    )
  }

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
          <Link className="secondary-button" to={`${basePath}/reports`}>
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
          <Link className="secondary-button" to={`${basePath}/reports`}>
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
