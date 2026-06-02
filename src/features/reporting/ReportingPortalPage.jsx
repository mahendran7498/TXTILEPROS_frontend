import { Toaster, toast } from 'react-hot-toast'
import Footer from '../../components/Footer'
import AccessDeniedPanel from '../../components/AccessDeniedPanel'
import AdminDashboard from './components/AdminDashboard'
import EmployeeDashboard from './components/EmployeeDashboard'
import LoginScreen from './components/LoginScreen'
import { DashboardHeader, TopCornerActions } from './components/SharedReportingUi'
import useReportingPortal from './useReportingPortal'

function isSalesDepartment(user) {
  return String(user?.department || '').trim().toLowerCase() === 'sales'
}

function canAccessServiceManagement(user) {
  return user?.role === 'admin' || (user?.role === 'manager' && !isSalesDepartment(user))
}

export default function ReportingPortalPage() {
  const {
    adminSectionPath,
    attendance,
    attendanceMonth,
    authLoading,
    credentials,
    dashboard,
    form,
    handleLeaveDecision,
    handleLogin,
    handleLogout,
    handleLeaveSubmit,
    handleReportSubmit,
    handleUserSubmit,
    handleUserToggle,
    isAuthenticated,
    leaveActionLoadingId,
    leaveForm,
    leaveSubmitting,
    leaves,
    locationPath,
    pageLoading,
    refreshDashboard,
    reportId,
    reports,
    selectedReport,
    selectedReportLoading,
    setCredentials,
    setAttendanceMonth,
    setForm,
    setLeaveForm,
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
              activePath={adminSectionPath}
              attendance={attendance}
              attendanceMonth={attendanceMonth}
              dashboard={dashboard}
              handleLeaveDecision={handleLeaveDecision}
              handleUserSubmit={handleUserSubmit}
              handleUserToggle={handleUserToggle}
              leaveActionLoadingId={leaveActionLoadingId}
              leaves={leaves}
              locationPath={locationPath}
              reportId={reportId}
              reports={reports}
              selectedReport={selectedReport}
              selectedReportLoading={selectedReportLoading}
              setAttendanceMonth={setAttendanceMonth}
              setUserForm={setUserForm}
              userForm={userForm}
              userSaving={userSaving}
              users={users}
            />
          ) : (
            <EmployeeDashboard
              form={form}
              leaveForm={leaveForm}
              leaveSubmitting={leaveSubmitting}
              leaves={leaves}
              onLeaveSubmit={handleLeaveSubmit}
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
