import { Link } from 'react-router-dom'

export default function SalesLoginScreen({ credentials, loading, setCredentials, onSubmit }) {
  return (
    <div className="login-shell">
      <section className="login-panel glass-card">
        <div className="eyebrow">TXTILPROS sales reporting</div>
        <h1>Sales Work Reporting</h1>
        <p className="lead">
          Sales employees can create new orders, upload company ID photos, and view only their own sales records.
        </p>

        <div className="login-module-switch">
          <Link className="login-module-chip" to="/login">Service Login</Link>
          <Link className="login-module-chip active" to="/sales/login">Sales Login</Link>
        </div>

        <form className="stack-lg" onSubmit={onSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              required
              type="email"
              value={credentials.email}
              onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
              placeholder="sales@txtilpros.local"
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              required
              type="password"
              value={credentials.password}
              onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
              placeholder="Enter your password"
            />
          </label>
          <button className="primary-button" disabled={loading} type="submit">
            {loading ? 'Signing in...' : 'Login to sales dashboard'}
          </button>
        </form>
      </section>
    </div>
  )
}
