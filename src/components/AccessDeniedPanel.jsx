export default function AccessDeniedPanel({ message = 'You do not have permission to access this page.' }) {
  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="glass-card section-card access-panel">
          <div className="eyebrow">Restricted area</div>
          <h1>Access Denied</h1>
          <p className="lead">{message}</p>
        </div>
      </section>
    </main>
  )
}
