import { AdminNavigation } from './SharedReportingUi'
import AdminAttendanceSection from './admin/AdminAttendanceSection'
import AdminEmployeesSection from './admin/AdminEmployeesSection'
import AdminLeavesSection from './admin/AdminLeavesSection'
import AdminMessagesSection from './admin/AdminMessagesSection'
import AdminOverviewSection from './admin/AdminOverviewSection'
import AdminReportDetailsSection from './admin/AdminReportDetailsSection'
import AdminReportsSection from './admin/AdminReportsSection'
import AdminSalariesSection from './admin/AdminSalariesSection'

export default function AdminDashboard({
  activePath,
  attendance,
  attendanceMonth,
  auditLogsBySalary,
  basePath,
  canViewMessages,
  canViewSalaries,
  contacts,
  dashboard,
  editSalaryForm,
  handleLeaveDecision,
  handleContactStatusUpdate,
  handleSalaryApprove,
  handleSalaryDownload,
  handleSalaryEditChange,
  handleSalaryGeneratePayslip,
  handleSalaryHistoryLoad,
  handleSalaryResendEmail,
  handleSalarySave,
  locationPath,
  leaveActionLoadingId,
  leaves,
  messageStatusUpdatingId,
  reportId,
  reports,
  salaries,
  salaryHistoryLoadingId,
  salaryMonth,
  salarySavingId,
  salaryStatus,
  selectedReport,
  selectedReportLoading,
  setAttendanceMonth,
  setEditSalaryForm,
  setSalaryMonth,
  setSalaryStatus,
  userForm,
  setUserForm,
  userSaving,
  handleUserSubmit,
  handleUserToggle,
  users,
}) {
  return (
    <>
      <AdminNavigation activePath={activePath} basePath={basePath} showMessages={canViewMessages} showSalaries={canViewSalaries} />
      {activePath === basePath ? <AdminOverviewSection basePath={basePath} dashboard={dashboard} reports={reports} /> : null}
      {activePath === `${basePath}/attendance` ? (
        <AdminAttendanceSection attendance={attendance} attendanceMonth={attendanceMonth} setAttendanceMonth={setAttendanceMonth} />
      ) : null}
      {activePath === `${basePath}/leaves` ? (
        <AdminLeavesSection leaveActionLoadingId={leaveActionLoadingId} leaves={leaves} onDecision={handleLeaveDecision} />
      ) : null}
      {canViewSalaries && activePath === `${basePath}/salaries` ? (
        <AdminSalariesSection
          auditLogsBySalary={auditLogsBySalary}
          editForm={editSalaryForm}
          historyLoadingId={salaryHistoryLoadingId}
          onApprove={handleSalaryApprove}
          onDownloadPdf={handleSalaryDownload}
          onEditChange={handleSalaryEditChange}
          onGeneratePayslip={handleSalaryGeneratePayslip}
          onLoadHistory={handleSalaryHistoryLoad}
          onResendEmail={handleSalaryResendEmail}
          onSave={handleSalarySave}
          salaries={salaries}
          salaryMonth={salaryMonth}
          salaryStatus={salaryStatus}
          savingSalaryId={salarySavingId}
          setEditForm={setEditSalaryForm}
          setSalaryMonth={setSalaryMonth}
          setSalaryStatus={setSalaryStatus}
        />
      ) : null}
      {activePath === `${basePath}/reports` ? <AdminReportsSection basePath={basePath} reports={reports} /> : null}
      {activePath === `${basePath}/employees` ? (
        <AdminEmployeesSection form={userForm} onSubmit={handleUserSubmit} onToggle={handleUserToggle} saving={userSaving} setForm={setUserForm} users={users} />
      ) : null}
      {canViewMessages && activePath === `${basePath}/messages` ? (
        <AdminMessagesSection messages={contacts} onStatusUpdate={handleContactStatusUpdate} updatingMessageId={messageStatusUpdatingId} />
      ) : null}
      {locationPath.startsWith(`${basePath}/reports/`) && reportId ? (
        <AdminReportDetailsSection basePath={basePath} loading={selectedReportLoading} report={selectedReport} />
      ) : null}
    </>
  )
}
