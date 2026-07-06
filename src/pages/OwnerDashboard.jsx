import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import AccessDeniedPanel from '../components/AccessDeniedPanel'
import { apiRequest } from '../features/reporting/api'
import { TOKEN_KEY } from '../features/reporting/constants'

export default function OwnerDashboard() {
  const navigate = useNavigate()
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    document.title = 'TXTILPROS | Owner Hub'
  }, [])

  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        const data = await apiRequest('/auth/me', {}, token)
        setUser(data.user)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        setToken('')
        navigate('/login', { replace: true })
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [navigate, token])

  if (loading) {
    return (
      <main className="app-shell">
        <section className="hero-panel">
          <div className="glass-card section-card access-panel">
            <p className="lead">Loading owner workspace...</p>
          </div>
        </section>
      </main>
    )
  }

  if (user?.role !== 'admin') {
    return <AccessDeniedPanel message="Only Owner can access the full module dashboard." />
  }

  return (
    <>
      <main className="app-shell">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <section className="hero-panel">
          <div className="glass-card section-card owner-hub">
            <div className="eyebrow">Super admin workspace</div>
            <h1>Owner Dashboard</h1>
            <p className="lead">Use this hub to enter the isolated Service and Sales modules with full owner visibility.</p>

            <div className="owner-hub-grid">
              <Link className="glass-card section-card owner-link-card" to="/dashboard/admin">
                <div className="eyebrow">Service module</div>
                <h3>Open Service Dashboard</h3>
                <p className="muted">Review reports, attendance, leaves, and service team activity.</p>
              </Link>

              <Link className="glass-card section-card owner-link-card" to="/sales/admin/orders">
                <div className="eyebrow">Sales module</div>
                <h3>Open Sales Dashboard</h3>
                <p className="muted">Review every sales order without exposing service data to sales users.</p>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
