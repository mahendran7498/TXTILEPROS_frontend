// ── ABOUT PAGE ──────────────────────────────────────────────────────────────
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function PageHero({ title, subtitle, crumb }) {
  return (
    <div style={{ background: 'var(--navy)', padding: '140px 32px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 50px,rgba(255,255,255,0.02) 50px,rgba(255,255,255,0.02) 51px),repeating-linear-gradient(90deg,transparent,transparent 50px,rgba(255,255,255,0.02) 50px,rgba(255,255,255,0.02) 51px)' }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Home</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>›</span>
          <span style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 600 }}>{crumb}</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(48px,5vw,72px)', color: 'white', letterSpacing: 3, lineHeight: 1 }}>{title}</h1>
        {subtitle && <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 17, marginTop: 16, lineHeight: 1.6 }}>{subtitle}</p>}
      </div>
    </div>
  )
}

export function About() {
  const timeline = [
    { year: '2014', event: 'TXTILPROS founded in Coimbatore, Tamil Nadu' },
    { year: '2015', event: 'Became authorized Red Flag Air Jet Loom dealer' },
    { year: '2017', event: 'Crossed 50 loom installations across Tamil Nadu' },
    { year: '2019', event: 'Expanded operations into Karnataka' },
    { year: '2021', event: 'Launched dedicated AMC service contracts' },
    { year: '2023', event: 'Crossed 200+ Air Jet Loom installations milestone' },
  ]
  const team = [
    { role: 'Managing Director', exp: '20+ yrs', spec: 'Textile Machinery' },
    { role: 'Chief Engineer', exp: '15+ yrs', spec: 'Air Jet Loom Tech' },
    { role: 'Service Head', exp: '12+ yrs', spec: 'Field Operations' },
    { role: 'Sales Manager', exp: '10+ yrs', spec: 'B2B Textile Sales' },
  ]
  return (
    <>
      <PageHero title="ABOUT TXTILPROS" subtitle="A decade of excellence in textile machinery solutions across South India." crumb="About Us" />
      {/* Intro */}
      <section style={{ background: 'var(--white)', padding: '100px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="about-resp">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="section-label">Our Story</span>
            <h2 className="section-title">From Vision to Industry Leadership</h2>
            <p style={{ fontSize: 16, color: '#4a5568', lineHeight: 1.8, marginBottom: 20 }}>
              TXTILPROS was founded in 2014 with a simple yet powerful vision — to bring world-class Air Jet Loom technology to Tamil Nadu's thriving textile industry, backed by expert service that customers could truly rely on.
            </p>
            <p style={{ fontSize: 16, color: '#4a5568', lineHeight: 1.8, marginBottom: 20 }}>
              Starting as a small team of passionate textile engineers, we quickly earned the trust of mill owners through our honest dealings, technical competence, and genuine commitment to after-sales support. Within a year, we became authorized dealers for Red Flag — one of China's most reputed loom manufacturers.
            </p>
            <p style={{ fontSize: 16, color: '#4a5568', lineHeight: 1.8 }}>
              Today, with 200+ Air Jet Looms installed across Tamil Nadu and Karnataka, TXTILPROS stands as a leading textile machinery company in South India — and we're just getting started.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div style={{ background: 'var(--navy)', borderRadius: 20, padding: 40 }}>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 28, color: 'white', letterSpacing: 1, marginBottom: 32 }}>OUR JOURNEY</h3>
              {timeline.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 20, marginBottom: i < timeline.length - 1 ? 24 : 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontSize: 13, color: 'white', flexShrink: 0 }}>{t.year}</div>
                    {i < timeline.length - 1 && <div style={{ width: 2, flex: 1, background: 'rgba(255,255,255,0.1)', marginTop: 4 }} />}
                  </div>
                  <div style={{ paddingBottom: i < timeline.length - 1 ? 20 : 0 }}>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginTop: 10 }}>{t.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <style>{`@media(max-width:1024px){ .about-resp { grid-template-columns:1fr !important; gap:40px !important; } }`}</style>
        </div>
      </section>

      {/* Mission / Vision */}
      <section style={{ background: 'var(--off-white)', padding: '80px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }} className="mv-grid">
            {[
              { label: '🎯 Mission', title: 'Our Mission', text: 'To provide reliable textile machinery solutions with excellent service, helping South India\'s weavers compete on a global stage.' },
              { label: '🔭 Vision', title: 'Our Vision', text: 'To become the most trusted textile machinery solution provider in India, known for integrity, expertise, and innovation.' },
              { label: '💎 Values', title: 'Our Values', text: 'Honesty in every transaction. Genuine parts always. Technical excellence as standard. Long-term partnerships over short-term gains.' },
            ].map((mv, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                style={{ background: 'white', borderRadius: 16, padding: 36, boxShadow: 'var(--shadow)', borderTop: '3px solid var(--orange)' }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{mv.label.split(' ')[0]}</div>
                <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 24, color: 'var(--navy)', letterSpacing: 1, marginBottom: 12 }}>{mv.title}</h3>
                <p style={{ fontSize: 15, color: '#4a5568', lineHeight: 1.7 }}>{mv.text}</p>
              </motion.div>
            ))}
            <style>{`@media(max-width:768px){ .mv-grid { grid-template-columns:1fr !important; } }`}</style>
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ background: 'var(--navy)', padding: '80px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <span className="section-label" style={{ color: 'rgba(244,115,32,0.9)' }}>Our Team</span>
          <h2 className="section-title light">Expert People Behind TXTILPROS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, marginTop: 48 }} className="team-grid">
            {team.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 28, textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: 'var(--font-head)', fontSize: 28, color: 'white' }}>
                  {m.role[0]}
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 6 }}>{m.role}</h4>
                <div style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 600, marginBottom: 4 }}>{m.exp} Experience</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{m.spec}</div>
              </motion.div>
            ))}
            <style>{`@media(max-width:768px){ .team-grid { grid-template-columns:1fr 1fr !important; } }`}</style>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div style={{ background: 'var(--orange)', padding: '60px 32px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 40, color: 'white', letterSpacing: 2, marginBottom: 20 }}>LET'S BUILD YOUR TEXTILE SUCCESS STORY</h2>
        <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: 'white', color: 'var(--orange)', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
          Contact Us Today
        </Link>
      </div>
    </>
  )
}

// ── SERVICES PAGE ────────────────────────────────────────────────────────────
export function Services() {
  const services = [
    {
      icon: '⚙️', title: 'Machine Installation', color: '#1e4fa0',
      desc: 'Professional setup and commissioning of Air Jet Looms by certified engineers ensuring optimal performance from day one.',
      benefits: ['Reduces commissioning time by 40%', 'Ensures warranty compliance', 'Operator training included', 'Complete documentation provided'],
      steps: ['Site inspection & preparation', 'Machine unloading & positioning', 'Precision alignment & leveling', 'Electrical & pneumatic connections', 'Test run & quality verification', 'Operator training & handover']
    },
    {
      icon: '🔧', title: 'Maintenance & Repair', color: '#f47320',
      desc: 'Comprehensive scheduled and emergency maintenance services to keep your production running at peak efficiency with minimal downtime.',
      benefits: ['Reduce breakdown incidents by 70%', 'Extend machine life by years', 'Predictable maintenance costs', 'Priority emergency response'],
      steps: ['Monthly inspection schedule', 'Lubrication & adjustments', 'Wear part assessment', 'Component replacement', 'Performance testing', 'Report & recommendations']
    },
    {
      icon: '📞', title: 'Technical Support', color: '#1a3a6b',
      desc: 'Round-the-clock technical assistance for operational issues, troubleshooting, and machine optimization.',
      benefits: ['24/7 availability', 'Remote troubleshooting', 'Multilingual support', 'Documented solutions'],
      steps: ['Issue reporting via call/WhatsApp', 'Remote diagnosis', 'Step-by-step guidance', 'Spare part identification', 'On-site dispatch if needed', 'Issue closure & follow-up']
    },
    {
      icon: '📐', title: 'Project Guidance', color: '#0a1628',
      desc: 'End-to-end consulting from factory planning to production setup for new weaving units and expansion projects.',
      benefits: ['Avoid costly planning mistakes', 'Optimized factory layout', 'Right machine selection', 'Clear ROI projections'],
      steps: ['Business requirement analysis', 'Factory layout design', 'Machine count & model selection', 'Power & utility planning', 'Budget & ROI projection', 'Implementation roadmap']
    },
    {
      icon: '📊', title: 'Cost Optimization', color: '#e85d04',
      desc: 'Expert analysis of your production process to identify savings and improve profitability.',
      benefits: ['Typical 10–20% cost reduction', 'Energy efficiency improvement', 'Waste reduction strategies', 'Benchmarking against industry'],
      steps: ['Production data collection', 'Energy consumption audit', 'Waste & downtime analysis', 'Benchmarking exercise', 'Recommendation report', 'Implementation support']
    },
    {
      icon: '📦', title: 'Spare Parts Supply', color: '#243d6e',
      desc: 'Fast supply of genuine Red Flag spare parts and accessories to minimize downtime.',
      benefits: ['Genuine OEM parts only', 'Local inventory for fast dispatch', 'Competitive pricing', 'Bulk order benefits'],
      steps: ['Part number identification', 'Availability check', 'Quotation within 2 hours', 'Order confirmation', 'Dispatch within 24 hours', 'Delivery tracking']
    },
  ]
  return (
    <>
      <PageHero title="OUR SERVICES" subtitle="Comprehensive textile machinery services designed to keep your production running at its best." crumb="Services" />
      <section style={{ background: 'var(--white)', padding: '100px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 60 }}>
            {services.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, alignItems: 'start', paddingBottom: 60, borderBottom: i < services.length - 1 ? '1px solid var(--light)' : 'none' }} className="svc-detail-resp"
              >
                <div>
                  <div style={{ width: 80, height: 80, background: s.color, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 20 }}>{s.icon}</div>
                  <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 32, color: 'var(--navy)', letterSpacing: 1, marginBottom: 12 }}>{s.title}</h2>
                  <p style={{ fontSize: 15, color: '#4a5568', lineHeight: 1.7, marginBottom: 20 }}>{s.desc}</p>
                  <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: 'var(--orange)', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>
                    Get Quote →
                  </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div style={{ background: 'var(--off-white)', borderRadius: 12, padding: 24 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' }}>Key Benefits</h4>
                    {s.benefits.map((b, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                        <span style={{ color: 'var(--orange)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.4 }}>{b}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'var(--navy)', borderRadius: 12, padding: 24 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' }}>Our Process</h4>
                    {s.steps.map((step, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                        <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white', flexShrink: 0, marginTop: 1 }}>{j + 1}</span>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <style>{`@media(max-width:768px){ .svc-detail-resp { grid-template-columns:1fr !important; gap:32px !important; } }`}</style>
        </div>
      </section>
    </>
  )
}

// ── PROJECTS PAGE ─────────────────────────────────────────────────────────────
export function Projects() {
  const stats = [
    { num: '200+', label: 'Air Jet Looms Installed', icon: '🏭' },
    { num: '2', label: 'States Covered', icon: '📍' },
    { num: '12', label: 'Years in Operation', icon: '📅' },
    { num: '100+', label: 'Happy Clients', icon: '🤝' },
  ]
  const caseStudies = [
    { title: 'Greenfield Weaving Unit — Coimbatore', looms: 50, duration: '3 months', outcome: '98% uptime, 15% under budget', desc: 'Complete turnkey project from layout planning to full production. 50 Red Flag looms installed and commissioned within 3 months.' },
    { title: 'Mill Expansion — Erode', looms: 30, duration: '6 weeks', outcome: 'Production capacity doubled', desc: 'Existing mill with 20 looms added 30 more units. Seamless integration with existing infrastructure and minimal production disruption.' },
    { title: 'New Weaving Shed — Bengaluru', looms: 20, duration: '8 weeks', outcome: 'ROI achieved in 18 months', desc: 'First-time textile entrepreneur supported with full project guidance, bank documentation support, and complete installation.' },
    { title: 'Fabric Diversification — Tirupur', looms: 15, duration: '4 weeks', outcome: '3 new fabric types introduced', desc: 'Existing cotton mill diversified into synthetic blends. Machine configuration and loom setup for new fabric types handled end-to-end.' },
  ]
  return (
    <>
      <PageHero title="PROJECTS & ACHIEVEMENTS" subtitle="A decade of successful installations and satisfied clients across South India's textile belt." crumb="Projects" />
      <section style={{ background: 'var(--off-white)', padding: '100px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, marginBottom: 80 }} className="pstats-grid">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ background: 'white', borderRadius: 14, padding: '32px 24px', textAlign: 'center', boxShadow: 'var(--shadow)', borderTop: '3px solid var(--orange)' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 52, color: 'var(--navy)', letterSpacing: 1, lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: 13, color: 'var(--gray)', marginTop: 8, fontWeight: 500 }}>{s.label}</div>
              </motion.div>
            ))}
            <style>{`@media(max-width:768px){ .pstats-grid { grid-template-columns:1fr 1fr !important; } }`}</style>
          </div>

          {/* Regions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 80 }} className="region-resp">
            {[
              { state: 'Tamil Nadu', num: '120+', cities: ['Coimbatore', 'Erode', 'Tirupur', 'Salem', 'Karur'], desc: 'Strong presence across the textile heartland of South India.' },
              { state: 'Karnataka', num: '80+', cities: ['Bengaluru', 'Davangere', 'Hubballi', 'Raichur'], desc: 'Expanding footprint in Karnataka\'s growing textile sector.' },
            ].map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                style={{ background: 'white', borderRadius: 14, padding: 32, boxShadow: 'var(--shadow)', borderLeft: '4px solid var(--orange)' }}>
                <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 28, color: 'var(--navy)', letterSpacing: 1 }}>{r.state}</h3>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 52, color: 'var(--orange)', lineHeight: 1, margin: '8px 0' }}>{r.num}</div>
                <p style={{ fontSize: 14, color: 'var(--gray)', lineHeight: 1.6, marginBottom: 16 }}>{r.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {r.cities.map(c => <span key={c} className="badge">{c}</span>)}
                </div>
              </motion.div>
            ))}
            <style>{`@media(max-width:768px){ .region-resp { grid-template-columns:1fr !important; } }`}</style>
          </div>

          {/* Case Studies */}
          <span className="section-label">Case Studies</span>
          <h2 className="section-title">Project Highlights</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 40 }} className="case-grid">
            {caseStudies.map((cs, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ background: 'var(--navy)', borderRadius: 14, padding: 32, color: 'white' }}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: 48, color: 'var(--orange)', lineHeight: 1 }}>{cs.looms}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Looms</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 20, letterSpacing: 1, marginBottom: 4 }}>{cs.title}</h3>
                    <div style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 600 }}>Duration: {cs.duration}</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 16 }}>{cs.desc}</p>
                <div style={{ background: 'rgba(244,115,32,0.15)', border: '1px solid rgba(244,115,32,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--orange)', fontWeight: 600 }}>
                  ✓ {cs.outcome}
                </div>
              </motion.div>
            ))}
            <style>{`@media(max-width:768px){ .case-grid { grid-template-columns:1fr !important; } }`}</style>
          </div>
        </div>
      </section>
    </>
  )
}

// ── GALLERY PAGE ──────────────────────────────────────────────────────────────
import { useState } from 'react'

export function Gallery() {
  const [active, setActive] = useState('all')
  const cats = ['all', 'machines', 'installation', 'team', 'factory']
  const items = [
    { cat: 'machines', label: 'Red Flag Air Jet Loom', bg: 'linear-gradient(135deg,#0f2044,#1e4fa0)', icon: '🏭', wide: true },
    { cat: 'installation', label: 'Machine Installation', bg: 'linear-gradient(135deg,#f47320,#0a1628)', icon: '🔧' },
    { cat: 'factory', label: 'Weaving Factory Floor', bg: 'linear-gradient(135deg,#0f2044,#243d6e)', icon: '🏗️', tall: true },
    { cat: 'machines', label: 'Loom Control Panel', bg: 'linear-gradient(135deg,#0a1628,#1e4fa0)', icon: '🖥️' },
    { cat: 'team', label: 'Service Engineer', bg: 'linear-gradient(135deg,#1e4fa0,#f47320)', icon: '👷' },
    { cat: 'installation', label: 'Commissioning Process', bg: 'linear-gradient(135deg,#243d6e,#0a1628)', icon: '⚙️' },
    { cat: 'machines', label: 'Electronic Control Board', bg: 'linear-gradient(135deg,#0a1628,#243d6e)', icon: '💡' },
    { cat: 'factory', label: 'Spare Parts Warehouse', bg: 'linear-gradient(135deg,#f47320,#1a3a6b)', icon: '📦' },
    { cat: 'team', label: 'Team Training Session', bg: 'linear-gradient(135deg,#1a3a6b,#0f2044)', icon: '📚' },
    { cat: 'installation', label: 'Site Preparation', bg: 'linear-gradient(135deg,#0f2044,#f47320)', icon: '🏗️' },
    { cat: 'machines', label: 'Reed Assembly', bg: 'linear-gradient(135deg,#1e4fa0,#0a1628)', icon: '🔩' },
    { cat: 'factory', label: 'Production in Progress', bg: 'linear-gradient(135deg,#243d6e,#1e4fa0)', icon: '🧵' },
  ]
  const filtered = active === 'all' ? items : items.filter(i => i.cat === active)
  return (
    <>
      <PageHero title="GALLERY" subtitle="A visual tour of our machines, installations, team, and factory operations." crumb="Gallery" />
      <section style={{ background: 'var(--off-white)', padding: '100px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
            {cats.map(c => (
              <button key={c} onClick={() => setActive(c)}
                style={{ padding: '8px 20px', borderRadius: 100, border: '1.5px solid', borderColor: active === c ? 'var(--orange)' : 'var(--light)', background: active === c ? 'var(--orange)' : 'white', color: active === c ? 'white' : 'var(--gray)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s', fontFamily: 'var(--font-body)' }}>
                {c === 'all' ? 'All Photos' : c}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, gridAutoRows: '200px' }} className="gallery-grid-resp">
            {filtered.map((item, i) => (
              <motion.div key={`${active}-${i}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                style={{ gridColumn: item.wide ? 'span 2' : 'span 1', gridRow: item.tall ? 'span 2' : 'span 1', borderRadius: 12, overflow: 'hidden', position: 'relative', cursor: 'pointer', background: item.bg }}
                className="gallery-cell"
              >
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, transition: 'transform 0.3s' }} className="gallery-inner">
                  {item.icon}
                </div>
                <div className="gal-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,22,40,0.8),transparent)', opacity: 0, display: 'flex', alignItems: 'flex-end', padding: 16, transition: 'opacity 0.3s' }}>
                  <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <style>{`
            .gallery-cell:hover .gal-overlay { opacity: 1 !important; }
            .gallery-cell:hover .gallery-inner { transform: scale(1.06); }
            @media(max-width:768px) { .gallery-grid-resp { grid-template-columns:1fr 1fr !important; } }
            @media(max-width:768px) { .gallery-grid-resp > div { grid-column: span 1 !important; grid-row: span 1 !important; } }
          `}</style>
        </div>
      </section>
    </>
  )
}

// ── BLOG PAGE ─────────────────────────────────────────────────────────────────
export function Blog() {
  const posts = [
    { cat: 'Industry News', title: 'Air Jet Loom Technology: What\'s New in 2025', date: 'March 2025', excerpt: 'The latest generation of Air Jet Looms brings significant improvements in speed, energy efficiency, and fabric versatility. Here\'s what textile entrepreneurs need to know about the 2025 generation machines.', bg: 'linear-gradient(135deg,#0a1628,#1e4fa0)', icon: '📰' },
    { cat: 'Maintenance', title: '5 Preventive Maintenance Checks Every Weaving Mill Must Do', date: 'February 2025', excerpt: 'Preventive maintenance is the key to avoiding costly breakdowns. Learn the 5 critical checks your maintenance team should perform weekly on Air Jet Looms to maximize uptime.', bg: 'linear-gradient(135deg,#f47320,#0a1628)', icon: '🔧' },
    { cat: 'Cost Saving', title: 'How to Reduce Your Weaving Mill\'s Energy Costs by 20%', date: 'January 2025', excerpt: 'Energy costs account for a significant portion of weaving mill expenses. We share proven strategies from our cost optimization consultancy to help you reduce consumption dramatically.', bg: 'linear-gradient(135deg,#1a3a6b,#f47320)', icon: '💰' },
    { cat: 'Industry News', title: 'Government Schemes for Textile MSMEs in 2025', date: 'December 2024', excerpt: 'Several Central and State government schemes are available to help textile MSMEs upgrade machinery and expand operations. Here\'s a comprehensive guide to what\'s applicable.', bg: 'linear-gradient(135deg,#0f2044,#1a3a6b)', icon: '🏛️' },
    { cat: 'Technical', title: 'Understanding Weft Insertion in Air Jet Looms', date: 'November 2024', excerpt: 'Air jet weft insertion is the heart of the Air Jet Loom. Understanding how it works helps operators troubleshoot issues and optimize settings for different yarn types.', bg: 'linear-gradient(135deg,#1e4fa0,#0a1628)', icon: '🧵' },
    { cat: 'Business', title: 'Starting a Weaving Business in Tamil Nadu: A Complete Guide', date: 'October 2024', excerpt: 'From land selection and power requirements to machine purchase and market linkages — a step-by-step guide for first-time textile entrepreneurs in Tamil Nadu.', bg: 'linear-gradient(135deg,#f47320,#1a3a6b)', icon: '📋' },
  ]
  const [activeCat, setActiveCat] = useState('All')
  const cats = ['All', 'Industry News', 'Maintenance', 'Cost Saving', 'Technical', 'Business']
  const filtered = activeCat === 'All' ? posts : posts.filter(p => p.cat === activeCat)
  return (
    <>
      <PageHero title="BLOG & UPDATES" subtitle="Industry insights, maintenance tips, and news from the world of textile machinery." crumb="Blog" />
      <section style={{ background: 'var(--white)', padding: '100px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 48, flexWrap: 'wrap' }}>
            {cats.map(c => (
              <button key={c} onClick={() => setActiveCat(c)}
                style={{ padding: '8px 20px', borderRadius: 100, border: '1.5px solid', borderColor: activeCat === c ? 'var(--orange)' : 'var(--light)', background: activeCat === c ? 'var(--orange)' : 'white', color: activeCat === c ? 'white' : 'var(--gray)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)' }}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }} className="blog-grid-resp">
            {filtered.map((post, i) => (
              <motion.div key={`${activeCat}-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                style={{ background: 'var(--off-white)', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s' }}
                whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(10,22,40,0.15)' }}
              >
                <div style={{ height: 200, background: post.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, position: 'relative' }}>
                  {post.icon}
                  <div style={{ position: 'absolute', top: 16, left: 16, background: 'var(--orange)', color: 'white', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '5px 10px', borderRadius: 100 }}>
                    {post.cat}
                  </div>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ fontSize: 11, color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>{post.date}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)', lineHeight: 1.4, marginBottom: 12 }}>{post.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.6, marginBottom: 20 }}>{post.excerpt}</p>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--orange)', display: 'flex', alignItems: 'center', gap: 6 }}>Read More →</div>
                </div>
              </motion.div>
            ))}
          </div>
          <style>{`@media(max-width:1024px){ .blog-grid-resp { grid-template-columns:1fr 1fr !important; } } @media(max-width:640px){ .blog-grid-resp { grid-template-columns:1fr !important; } }`}</style>
          <div style={{ textAlign: 'center', marginTop: 60 }}>
            <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'var(--navy)', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
              📧 Subscribe to Newsletter
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

// ── PRODUCTS PAGE ─────────────────────────────────────────────────────────────
export function Products() {
  const specs = [
    { label: 'Max Speed', val: '800–1200 RPM' }, { label: 'Reed Width', val: '150 – 360 cm' },
    { label: 'Weft Insertion', val: 'Air Jet (Multi-nozzle)' }, { label: 'Fabric Types', val: 'Cotton, Synthetic, Blends' },
    { label: 'Control System', val: 'PLC + Touch Panel' }, { label: 'Warranty', val: '1 Year + Extended' },
    { label: 'Power Supply', val: '3-Phase, 380V/50Hz' }, { label: 'Air Pressure', val: '5–7 Bar' },
  ]
  const features = ['High Speed', 'Energy Efficient', 'Multi-Fabric', 'Digital Control', 'Wide Width', 'Low Maintenance', 'Auto Stop', 'Digital Counter']
  const parts = [
    { icon: '💨', name: 'Air Nozzles', sub: 'Main & sub nozzles' },
    { icon: '⚡', name: 'Reed Assembly', sub: 'All widths & counts' },
    { icon: '🔄', name: 'Cam Mechanisms', sub: 'Rotary dobby & positive' },
    { icon: '💻', name: 'Control Boards', sub: 'PLC, inverters, sensors' },
    { icon: '⚙️', name: 'Bearings & Shafts', sub: 'Precision bearings' },
    { icon: '🔗', name: 'Timing Belts', sub: 'OEM belts' },
    { icon: '✂️', name: 'Weft Cutters', sub: 'Precision blades' },
    { icon: '📡', name: 'Sensors', sub: 'Weft & selvedge detectors' },
  ]
  return (
    <>
      <PageHero title="OUR PRODUCTS" subtitle="State-of-the-art Red Flag Air Jet Looms and genuine spare parts for your textile operation." crumb="Products" />
      <section style={{ background: 'var(--white)', padding: '100px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', marginBottom: 80 }} className="prod-resp">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              style={{ background: 'var(--navy)', borderRadius: 20, padding: 48, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'conic-gradient(from 0deg, transparent 70%, rgba(244,115,32,0.04) 100%)', animation: 'rotate 20s linear infinite' }} />
              <svg viewBox="0 0 300 300" fill="none" style={{ width: '100%', maxWidth: 300, position: 'relative', zIndex: 1 }}>
                <rect x="30" y="40" width="240" height="200" rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(244,115,32,0.4)" strokeWidth="1.5"/>
                <rect x="20" y="210" width="260" height="28" rx="8" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <rect x="100" y="55" width="20" height="130" rx="4" fill="rgba(244,115,32,0.15)" stroke="rgba(244,115,32,0.4)" strokeWidth="1"/>
                <rect x="180" y="55" width="20" height="130" rx="4" fill="rgba(244,115,32,0.15)" stroke="rgba(244,115,32,0.4)" strokeWidth="1"/>
                {[50,70,90,130,150,170,210,230,250].map(x => <line key={x} x1={x} y1="50" x2={x} y2="210" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>)}
                <rect x="30" y="148" width="24" height="14" rx="4" fill="#f47320" opacity="0.9"/>
                <path d="M54 155 Q110 148 150 155 Q190 162 246 155" stroke="#f47320" strokeWidth="2" fill="none" strokeDasharray="4 2"/>
                <rect x="240" y="50" width="6" height="160" rx="2" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                <text x="150" y="290" textAnchor="middle" fill="rgba(244,115,32,0.8)" fontSize="13" fontFamily="'Bebas Neue', sans-serif" letterSpacing="3">RED FLAG AIR JET LOOM</text>
              </svg>
              <style>{`@keyframes rotate { to { transform:rotate(360deg); } }`}</style>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 48, color: 'var(--navy)', letterSpacing: 2, lineHeight: 1, marginBottom: 8 }}>RED FLAG<br />AIR JET LOOM</h1>
              <div style={{ fontSize: 16, color: 'var(--orange)', fontWeight: 600, marginBottom: 20 }}>High-Performance Weaving Technology</div>
              <p style={{ fontSize: 15, color: '#4a5568', lineHeight: 1.8, marginBottom: 28 }}>
                The Red Flag Air Jet Loom represents the pinnacle of modern weaving technology — combining high-speed air-jet weft insertion with precision control electronics. Trusted by mills across Tamil Nadu and Karnataka for consistent fabric quality and reliable operation.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
                {features.map(f => (
                  <span key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(244,115,32,0.08)', border: '1px solid rgba(244,115,32,0.2)', borderRadius: 100, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: 'var(--orange)' }}>
                    ✓ {f}
                  </span>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
                {specs.map(s => (
                  <div key={s.label} style={{ background: 'var(--off-white)', borderRadius: 8, padding: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gray)' }}>{s.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', marginTop: 4 }}>{s.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn btn-primary">Request Quote</Link>
                <Link to="/contact" className="btn btn-dark">Download Brochure</Link>
              </div>
            </motion.div>
            <style>{`@media(max-width:1024px){ .prod-resp { grid-template-columns:1fr !important; gap:40px !important; } }`}</style>
          </div>

          {/* Spare Parts */}
          <div style={{ marginTop: 60 }}>
            <span className="section-label">Also Available</span>
            <h2 className="section-title" style={{ fontSize: 36 }}>Spare Parts & Accessories</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginTop: 40 }} className="parts-grid">
              {parts.map((p, i) => (
                <motion.div key={i} whileHover={{ background: 'var(--navy)', y: -4 }}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  style={{ background: 'var(--off-white)', borderRadius: 'var(--radius)', padding: 24, textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer' }}
                >
                  <div style={{ width: 48, height: 48, background: 'var(--orange)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 22 }}>{p.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray)' }}>{p.sub}</div>
                </motion.div>
              ))}
              <style>{`@media(max-width:768px){ .parts-grid { grid-template-columns:1fr 1fr !important; } }`}</style>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
