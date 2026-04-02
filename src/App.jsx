import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import FloatingActions from './components/FloatingActions'
import Home from './pages/Home'
import Contact from './pages/Contact'
import ReportingPortal from './pages/ReportingPortal'
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
      <Route path="/dashboard" element={<ReportingPortal />} />
      <Route path="/dashboard/admin" element={<ReportingPortal />} />
      <Route path="/dashboard/admin/reports" element={<ReportingPortal />} />
      <Route path="/dashboard/admin/reports/:reportId" element={<ReportingPortal />} />
      <Route path="/dashboard/admin/employees" element={<ReportingPortal />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}
