import { StatCard } from '../SharedReportingUi'
import AdminSectionIntro from './AdminSectionIntro'
import AdminReportsSection from './AdminReportsSection'

export default function AdminOverviewSection({ basePath, dashboard, reports }) {
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
        <StatCard label="Pending leaves" value={dashboard.pendingLeaves || 0} hint={`${dashboard.approvedLeaves || 0} approved overall`} />
        <StatCard label="Rejected leaves" value={dashboard.rejectedLeaves || 0} hint="Closed without approval" />
      </section>
      <AdminReportsSection
        basePath={basePath}
        reports={reports.slice(0, 6)}
        title="Latest company reports"
        subtitle="Recent employee submissions shown in the same format as the reports section."
      />
    </>
  )
}
