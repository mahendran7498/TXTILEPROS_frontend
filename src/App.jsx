import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import FloatingActions from './components/FloatingActions'
import Home from './pages/Home'
import Contact from './pages/Contact'
import ReportingPortal from './pages/ReportingPortal'
import SalesPortal from './pages/SalesPortal'
import OwnerDashboard from './pages/OwnerDashboard'
import { About, Blog, Gallery, Products, Projects, Services } from './pages/OtherPages'

function MarketingLayout() {
  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <Outlet />
      <FloatingActions />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/login" element={<ReportingPortal />} />
      <Route path="/owner/dashboard" element={<OwnerDashboard />} />
      <Route path="/dashboard" element={<ReportingPortal />} />
      <Route path="/dashboard/attendance" element={<ReportingPortal />} />
      <Route path="/dashboard/leaves" element={<ReportingPortal />} />
      <Route path="/dashboard/salaries" element={<ReportingPortal />} />
      <Route path="/dashboard/reports" element={<ReportingPortal />} />
      <Route path="/dashboard/reports/:reportId" element={<ReportingPortal />} />
      <Route path="/dashboard/employees" element={<ReportingPortal />} />
      <Route path="/dashboard/admin" element={<ReportingPortal />} />
      <Route path="/dashboard/admin/attendance" element={<ReportingPortal />} />
      <Route path="/dashboard/admin/leaves" element={<ReportingPortal />} />
      <Route path="/dashboard/admin/salaries" element={<ReportingPortal />} />
      <Route path="/dashboard/admin/messages" element={<ReportingPortal />} />
      <Route path="/dashboard/admin/reports" element={<ReportingPortal />} />
      <Route path="/dashboard/admin/reports/:reportId" element={<ReportingPortal />} />
      <Route path="/dashboard/admin/employees" element={<ReportingPortal />} />
      <Route path="/sales/login" element={<SalesPortal />} />
      <Route path="/sales/dashboard" element={<SalesPortal />} />
      <Route path="/sales/orders/new" element={<SalesPortal />} />
      <Route path="/sales/orders" element={<SalesPortal />} />
      <Route path="/sales/admin/orders" element={<SalesPortal />} />
      <Route path="/sales/admin/employees" element={<SalesPortal />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}
