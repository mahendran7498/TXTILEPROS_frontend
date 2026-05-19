import { AdminNavigation } from './SharedReportingUi'
import AdminAttendanceSection from './admin/AdminAttendanceSection'
import AdminEmployeesSection from './admin/AdminEmployeesSection'
import AdminLeavesSection from './admin/AdminLeavesSection'
import AdminOverviewSection from './admin/AdminOverviewSection'
import AdminReportDetailsSection from './admin/AdminReportDetailsSection'
import AdminReportsSection from './admin/AdminReportsSection'

export default function AdminDashboard({
  activePath,
  attendance,
  attendanceMonth,
  dashboard,
  handleLeaveDecision,
  locationPath,
  leaveActionLoadingId,
  leaves,
  reportId,
  reports,
  selectedReport,
  selectedReportLoading,
  setAttendanceMonth,
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
      {locationPath === '/dashboard/admin' ? <AdminOverviewSection dashboard={dashboard} reports={reports} /> : null}
      {locationPath === '/dashboard/admin/attendance' ? (
        <AdminAttendanceSection attendance={attendance} attendanceMonth={attendanceMonth} setAttendanceMonth={setAttendanceMonth} />
      ) : null}
      {locationPath === '/dashboard/admin/leaves' ? (
        <AdminLeavesSection leaveActionLoadingId={leaveActionLoadingId} leaves={leaves} onDecision={handleLeaveDecision} />
      ) : null}
      {locationPath === '/dashboard/admin/reports' ? <AdminReportsSection reports={reports} /> : null}
      {locationPath === '/dashboard/admin/employees' ? (
        <AdminEmployeesSection form={userForm} onSubmit={handleUserSubmit} onToggle={handleUserToggle} saving={userSaving} setForm={setUserForm} users={users} />
      ) : null}
      {locationPath.startsWith('/dashboard/admin/reports/') && reportId ? (
        <AdminReportDetailsSection loading={selectedReportLoading} report={selectedReport} />
      ) : null}
    </>
  )
}
