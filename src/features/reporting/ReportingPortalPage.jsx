import { Toaster, toast } from 'react-hot-toast'
import Footer from '../../components/Footer'
import AccessDeniedPanel from '../../components/AccessDeniedPanel'
import AdminDashboard from './components/AdminDashboard'
import EmployeeDashboard from './components/EmployeeDashboard'
import LoginScreen from './components/LoginScreen'
import { DashboardHeader, TopCornerActions } from './components/SharedReportingUi'
import useReportingPortal from './useReportingPortal'

function isSalesDepartment(user) {
  return String(user?.department || '').trim().toLowerCase().includes('sales')
}

function canAccessServiceManagement(user) {
  return user?.role === 'admin' || (user?.role === 'manager' && !isSalesDepartment(user))
}

function canViewSalaries(user) {
  return user?.role === 'admin'
}

function canViewMessages(user) {
  return user?.role === 'admin'
}

export default function ReportingPortalPage() {
  const {
    attendance,
    attendanceMonth,
    auditLogsBySalary,
    authLoading,
    contacts,
    credentials,
    dashboard,
    editSalaryForm,
    form,
    editingReportId,
    handleLeaveDecision,
    handleLeaveEdit,
    handleEditReport,
    handleLogin,
    handleLogout,
    handleCancelReportEdit,
    handleContactStatusUpdate,
    handleLeaveSubmit,
    handleReportSubmit,
    handleEmployeePayslipDownload,
    handleSalaryApprove,
    handleSalaryDownload,
    handleSalaryEditChange,
    handleSalaryGeneratePayslip,
    handleSalaryHistoryLoad,
    handleSalaryResendEmail,
    handleSalarySave,
    handleUserSubmit,
    handleUserToggle,
    isAuthenticated,
    leaveActionLoadingId,
    leaveForm,
    leaveSubmitting,
    leaves,
    locationPath,
    managementBasePath,
    managementSectionPath,
    messageStatusUpdatingId,
    pageLoading,
    refreshDashboard,
    reportId,
    reports,
    salaries,
    salaryHistoryLoadingId,
    salaryMonth,
    salarySavingId,
    salaryStatus,
    selectedReport,
    selectedReportLoading,
    setCredentials,
    setAttendanceMonth,
    setEditSalaryForm,
    setForm,
    setLeaveForm,
    setSalaryMonth,
    setSalaryStatus,
    setUserForm,
    setWeekStart,
    submitting,
    summary,
    user,
    userForm,
    userSaving,
    users,
    weekStart,
  } = useReportingPortal()

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" />
        <TopCornerActions
          onLoginClick={() => document.getElementById('login-email')?.focus()}
          onRegisterClick={() => toast('Please contact admin to create your TXTILPROS account.')}
          onSettingsClick={() => toast('Settings page coming soon.')}
          showAuthButtons
        />
        <LoginScreen credentials={credentials} loading={authLoading || pageLoading} onSubmit={handleLogin} setCredentials={setCredentials} />
        <Footer />
      </>
    )
  }

  if (isSalesDepartment(user)) {
    return <AccessDeniedPanel message="Sales users cannot access the service module." />
  }

  return (
    <>
      <Toaster position="top-right" />
      <TopCornerActions onSettingsClick={() => toast('Settings page coming soon.')} showAuthButtons={false} />
      <main className="app-shell">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <section className="hero-panel">
          <DashboardHeader onLogout={handleLogout} refresh={refreshDashboard} setWeekStart={setWeekStart} user={user} weekStart={weekStart} />

          {canAccessServiceManagement(user) ? (
            <AdminDashboard
              activePath={managementSectionPath}
              attendance={attendance}
              attendanceMonth={attendanceMonth}
              auditLogsBySalary={auditLogsBySalary}
              basePath={managementBasePath}
              canViewMessages={canViewMessages(user)}
              canViewSalaries={canViewSalaries(user)}
              contacts={contacts}
              dashboard={dashboard}
              editSalaryForm={editSalaryForm}
              handleContactStatusUpdate={handleContactStatusUpdate}
              handleLeaveDecision={handleLeaveDecision}
              handleLeaveEdit={handleLeaveEdit}
              handleSalaryApprove={handleSalaryApprove}
              handleSalaryDownload={handleSalaryDownload}
              handleSalaryEditChange={handleSalaryEditChange}
              handleSalaryGeneratePayslip={handleSalaryGeneratePayslip}
              handleSalaryHistoryLoad={handleSalaryHistoryLoad}
              handleSalaryResendEmail={handleSalaryResendEmail}
              handleSalarySave={handleSalarySave}
              handleUserSubmit={handleUserSubmit}
              handleUserToggle={handleUserToggle}
              leaveActionLoadingId={leaveActionLoadingId}
              leaves={leaves}
              locationPath={locationPath}
              reportId={reportId}
              reports={reports}
              messageStatusUpdatingId={messageStatusUpdatingId}
              salaries={salaries}
              salaryHistoryLoadingId={salaryHistoryLoadingId}
              salaryMonth={salaryMonth}
              salarySavingId={salarySavingId}
              salaryStatus={salaryStatus}
              selectedReport={selectedReport}
              selectedReportLoading={selectedReportLoading}
              setAttendanceMonth={setAttendanceMonth}
              setEditSalaryForm={setEditSalaryForm}
              setSalaryMonth={setSalaryMonth}
              setSalaryStatus={setSalaryStatus}
              setUserForm={setUserForm}
              userForm={userForm}
              userSaving={userSaving}
              users={users}
            />
          ) : (
            <EmployeeDashboard
              form={form}
              editingReportId={editingReportId}
              leaveForm={leaveForm}
              leaveSubmitting={leaveSubmitting}
              leaves={leaves}
              salaries={salaries}
              onCancelReportEdit={handleCancelReportEdit}
              onEditReport={handleEditReport}
              onLeaveSubmit={handleLeaveSubmit}
              onPayslipDownload={handleEmployeePayslipDownload}
              onSubmit={handleReportSubmit}
              reports={reports}
              setForm={setForm}
              setLeaveForm={setLeaveForm}
              submitting={submitting}
              summary={summary}
            />
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
