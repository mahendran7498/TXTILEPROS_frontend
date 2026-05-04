import { Toaster, toast } from 'react-hot-toast'
import Footer from '../../components/Footer'
import AdminDashboard from './components/AdminDashboard'
import EmployeeDashboard from './components/EmployeeDashboard'
import LoginScreen from './components/LoginScreen'
import { DashboardHeader, TopCornerActions } from './components/SharedReportingUi'
import useReportingPortal from './useReportingPortal'

export default function ReportingPortalPage() {
  const {
    adminSectionPath,
    attendance,
    attendanceMonth,
    authLoading,
    credentials,
    dashboard,
    form,
    handleLogin,
    handleLogout,
    handleReportSubmit,
    handleUserSubmit,
    handleUserToggle,
    isAuthenticated,
    locationPath,
    pageLoading,
    refreshDashboard,
    reportId,
    reports,
    selectedReport,
    setCredentials,
    setAttendanceMonth,
    setForm,
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

  return (
    <>
      <Toaster position="top-right" />
      <TopCornerActions onSettingsClick={() => toast('Settings page coming soon.')} showAuthButtons={false} />
      <main className="app-shell">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <section className="hero-panel">
          <DashboardHeader onLogout={handleLogout} refresh={refreshDashboard} setWeekStart={setWeekStart} user={user} weekStart={weekStart} />

          {user.role === 'admin' ? (
            <AdminDashboard
              activePath={adminSectionPath}
              attendance={attendance}
              attendanceMonth={attendanceMonth}
              dashboard={dashboard}
              handleUserSubmit={handleUserSubmit}
              handleUserToggle={handleUserToggle}
              locationPath={locationPath}
              reportId={reportId}
              reports={reports}
              selectedReport={selectedReport}
              setAttendanceMonth={setAttendanceMonth}
              setUserForm={setUserForm}
              userForm={userForm}
              userSaving={userSaving}
              users={users}
            />
          ) : (
            <EmployeeDashboard form={form} onSubmit={handleReportSubmit} reports={reports} setForm={setForm} submitting={submitting} summary={summary} />
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
