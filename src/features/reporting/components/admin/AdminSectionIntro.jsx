export default function AdminSectionIntro({ eyebrow, title, description, aside }) {
  return (
    <section className="glass-card section-card admin-section-intro">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h3>{title}</h3>
        <p className="muted">{description}</p>
      </div>
      {aside ? <div className="admin-section-aside">{aside}</div> : null}
    </section>
  )
}
