import { Link } from 'react-router-dom'

export default function LoginScreen({ credentials, loading, setCredentials, onSubmit }) {
  return (
    <div className="login-shell">
      <section className="login-panel glass-card">
        <div className="eyebrow">TXTILPROS service reporting</div>
        <h1>Employee Work Reporting</h1>
        <p className="lead">
          Daily updates, machine issues, photo uploads, weekly summaries, and admin visibility for textile machinery service teams.
        </p>

        <div className="login-module-switch">
          <Link className="login-module-chip active" to="/login">Service Login</Link>
          <Link className="login-module-chip" to="/sales/login">Sales Login</Link>
        </div>

        <form className="stack-lg" onSubmit={onSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              id="login-email"
              required
              type="email"
              value={credentials.email}
              onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
              placeholder="employee@txtilpros.local"
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
          <Link className="login-help-link" to="/forgot-password">Forgot your password?</Link>
          <button className="primary-button" disabled={loading} type="submit">
            {loading ? 'Signing in...' : 'Login to dashboard'}
          </button>
        </form>
      </section>
    </div>
  )
}
