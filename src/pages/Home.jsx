import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaPhone, FaCogs, FaWrench, FaHeadset, FaProjectDiagram, FaChartLine, FaBoxes, FaCertificate, FaGlobeAsia, FaMapMarkerAlt, FaClock, FaRupeeSign, FaFileContract, FaWhatsapp } from 'react-icons/fa'

const stats = [
  { num: '200+', label: 'Looms Installed' },
  { num: '20+', label: 'Years Experience' },
  { num: '2', label: 'States Covered' },
  { num: '24/7', label: 'After-Sales Support' },
]

const highlights = [
  { icon: <FaCogs size={28} />, num: '200+', label: 'Air Jet Looms Installed' },
  { icon: <FaCertificate size={28} />, num: '20+', label: 'Years of Industry Experience' },
  { icon: <FaHeadset size={28} />, num: 'Expert', label: 'Engineers Team' },
  { icon: <FaPhone size={28} />, num: '24/7', label: 'After-Sales Support' },
]

const services = [
  { icon: <FaCogs size={24} />, title: 'Machine Installation', desc: 'Professional setup and commissioning by trained engineers for optimal performance from day one.', list: ['Site preparation assessment', 'Precision alignment & leveling', 'Commissioning & trial runs', 'Operator training & handover'] },
  { icon: <FaWrench size={24} />, title: 'Maintenance & Repair', desc: 'Scheduled and emergency maintenance to keep production running at peak efficiency.', list: ['Preventive maintenance', 'Emergency breakdown response', 'Component overhaul & replacement', 'Performance optimization'] },
  { icon: <FaHeadset size={24} />, title: 'Technical Support', desc: 'Round-the-clock technical assistance for operational issues and troubleshooting.', list: ['24/7 phone support', 'Remote diagnostics', 'On-site engineer dispatch', 'Multilingual support'] },
  { icon: <FaProjectDiagram size={24} />, title: 'Project Guidance', desc: 'End-to-end consulting from factory planning to production setup for new units.', list: ['Factory layout planning', 'Capacity planning', 'Power & utility requirements', 'ROI & payback analysis'] },
  { icon: <FaChartLine size={24} />, title: 'Cost Optimization', desc: 'Expert analysis to identify savings opportunities and improve profitability.', list: ['Energy consumption audit', 'Productivity benchmarking', 'Spare parts review', 'Process efficiency'] },
  { icon: <FaBoxes size={24} />, title: 'Spare Parts Supply', desc: 'Fast supply of genuine Red Flag spare parts to minimize downtime.', list: ['100% genuine parts', 'Fast nationwide delivery', 'Comprehensive inventory', 'Bulk order discounts'] },
]

const testimonials = [
  { text: '"TXTILPROS helped us set up our entire weaving unit from scratch. Their project guidance saved us a lot of time and money."', name: 'Rajendran S.', role: 'Mill Owner, Coimbatore', avatar: 'R' },
  { text: '"When our loom broke down unexpectedly, TXTILPROS sent a technician the very next morning. Outstanding after-sales support."', name: 'Mohammed Basheer', role: 'Weaving Entrepreneur, Erode', avatar: 'M' },
  { text: '"We expanded from 10 to 40 looms with TXTILPROS. Competitive pricing, professional installation. Very happy."', name: 'Karthik Textiles', role: 'Production Head, Salem', avatar: 'K' },
  { text: '"As a first-time entrepreneur, TXTILPROS walked me through every step and ensured I understood the ROI potential."', name: 'Suresh Kumar', role: 'New Entrepreneur, Bengaluru', avatar: 'S' },
  { text: '"Spare parts delivery is always fast. We never face long downtime anymore since switching to TXTILPROS for maintenance."', name: 'Prakash Weaves', role: 'Operations Manager, Tirupur', avatar: 'P' },
  { text: '"Their cost optimization audit found 12% savings in energy costs. They genuinely want your business to succeed."', name: 'Vijay Anand', role: 'Factory Owner, Hubballi', avatar: 'V' },
]

const whyItems = [
  { num: '01', title: 'Authorized Red Flag Dealer', desc: 'Direct partnership with Red Flag means genuine machines, authentic parts, and manufacturer-backed warranty on every purchase.' },
  { num: '02', title: 'Internationally Trained Engineers', desc: 'Our service team has undergone factory training at Red Flag\'s facilities, ensuring expert installation to original standards.' },
  { num: '03', title: 'Local Market Knowledge', desc: 'Deep understanding of Tamil Nadu and Karnataka\'s textile industries means advice relevant to your specific market.' },
  { num: '04', title: 'Fast Parts & Service Response', desc: 'Local spare parts inventory for fast dispatch. Most service requests attended within 24–48 hours in our coverage area.' },
]

const whyVisual = [
  { icon: <FaCertificate size={32} />, label: 'Authorized Dealer' },
  { icon: <FaGlobeAsia size={32} />, label: 'International Training' },
  { icon: <FaMapMarkerAlt size={32} />, label: 'Local Presence' },
  { icon: <FaClock size={32} />, label: 'Fast Response' },
  { icon: <FaRupeeSign size={32} />, label: 'Competitive Pricing' },
  { icon: <FaFileContract size={32} />, label: 'AMC Contracts' },
]

function FadeUp({ children, delay = 0, style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', background: 'var(--navy)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        {/* BG effects */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,22,40,0.97) 0%, rgba(15,32,68,0.90) 50%, rgba(26,58,107,0.85) 100%)', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.04, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,1) 40px, rgba(255,255,255,1) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,1) 40px, rgba(255,255,255,1) 41px)' }} />
        <div style={{ position: 'absolute', right: -100, top: -100, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,115,32,0.15) 0%, transparent 70%)', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '72px 32px 0', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="hero-grid">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(244,115,32,0.15)', border: '1px solid rgba(244,115,32,0.3)', padding: '6px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--orange)', animation: 'pulse 2s infinite', display: 'block' }} />
              Established 2014 · Tamil Nadu & Karnataka
            </div>
            <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(52px,5.5vw,86px)', color: 'white', letterSpacing: 3, lineHeight: 0.95, marginBottom: 8 }}>
              LEADING<br />TEXTILE<br /><span style={{ color: 'var(--orange)' }}>MACHINERY</span><br />EXPERTS
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', margin: '20px 0 40px', lineHeight: 1.7, maxWidth: 480 }}>
              Trusted Air Jet Loom Solutions Since 2014. Red Flag authorized dealer with 200+ installations across South India.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/login" className="btn btn-outline">Employee Login</Link>
              <Link to="/contact" className="btn btn-primary"><FaPhone /> Contact Us</Link>
              <Link to="/products" className="btn btn-outline"><FaCogs /> View Products</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 48 }}>
              {stats.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', padding: 20, backdropFilter: 'blur(10px)' }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 40, color: 'var(--orange)', letterSpacing: 1, lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 6 }}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="hero-visual">
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: 32, backdropFilter: 'blur(12px)' }}>
              <div style={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 200 200" fill="none" style={{ width: 180, height: 180 }}>
                  <rect x="20" y="20" width="160" height="140" rx="8" stroke="rgba(244,115,32,0.4)" strokeWidth="2" fill="none"/>
                  {[40,60,80,100,120,140,160].map(x => <line key={x} x1={x} y1="30" x2={x} y2="150" stroke="rgba(244,115,32,0.3)" strokeWidth="1"/>)}
                  <path d="M30 60 Q45 55 60 60 Q75 65 90 60 Q105 55 120 60 Q135 65 150 60 Q165 55 170 60" stroke="white" strokeWidth="1.5" fill="none" strokeOpacity="0.5"/>
                  <path d="M30 80 Q45 85 60 80 Q75 75 90 80 Q105 85 120 80 Q135 75 150 80 Q165 85 170 80" stroke="white" strokeWidth="1.5" fill="none" strokeOpacity="0.5"/>
                  <path d="M30 100 Q45 95 60 100 Q75 105 90 100 Q105 95 120 100 Q135 105 150 100 Q165 95 170 100" stroke="white" strokeWidth="1.5" fill="none" strokeOpacity="0.5"/>
                  <path d="M30 120 Q45 125 60 120 Q75 115 90 120 Q105 125 120 120 Q135 115 150 120 Q165 125 170 120" stroke="white" strokeWidth="1.5" fill="none" strokeOpacity="0.5"/>
                  <rect x="55" y="88" width="90" height="14" rx="7" fill="rgba(244,115,32,0.8)"/>
                  <rect x="15" y="155" width="170" height="20" rx="6" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 26, color: 'white', letterSpacing: 2 }}>RED FLAG AIR JET LOOM</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>High-performance weaving solutions for modern textile mills</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { icon: '🔧', label: 'Expert Service & Maintenance' },
                { icon: '📦', label: 'Genuine Spare Parts Supply' },
              ].map((c, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', padding: 20 }}>
                  <div style={{ fontSize: 22, marginBottom: 10 }}>{c.icon}</div>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{c.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <style>{`
          @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
          @media (max-width:1024px) { .hero-grid { grid-template-columns:1fr !important; } .hero-visual { display:none !important; } }
        `}</style>
      </section>

      {/* ── HIGHLIGHTS ── */}
      <div style={{ background: 'var(--orange)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }} className="hl-grid">
          {highlights.map((h, i) => (
            <div key={i} style={{ padding: '28px 24px', display: 'flex', alignItems: 'center', gap: 16, borderRight: i < 3 ? '1px solid rgba(255,255,255,0.2)' : 'none' }}>
              <div style={{ color: 'rgba(255,255,255,0.8)', flexShrink: 0 }}>{h.icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 32, color: 'white', letterSpacing: 1, lineHeight: 1 }}>{h.num}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{h.label}</div>
              </div>
            </div>
          ))}
          <style>{`@media(max-width:768px){ .hl-grid { grid-template-columns:1fr 1fr !important; } }`}</style>
        </div>
      </div>

      {/* ── ABOUT SHORT ── */}
      <section style={{ background: 'var(--off-white)', padding: '100px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="about-grid-resp">
          <FadeUp>
            <div style={{ background: 'var(--navy)', borderRadius: 16, padding: 48, color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: 24, top: 16, fontFamily: 'var(--font-head)', fontSize: 100, color: 'rgba(255,255,255,0.06)', lineHeight: 1, letterSpacing: -4 }}>2014</div>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 32, letterSpacing: 2 }}>TXTILPROS<br />TEXTILE EXPERTS</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 12, lineHeight: 1.7, fontSize: 15 }}>
                Founded in 2014, TXTILPROS has grown to become a trusted name in textile machinery solutions across South India.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24 }}>
                {['Red Flag Authorized Dealer', 'Tamil Nadu', 'Karnataka'].map(b => (
                  <span key={b} className="badge">{b}</span>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--orange)', borderRadius: 12, padding: '20px 24px', color: 'white', display: 'inline-block', marginTop: 20, boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 36, letterSpacing: 1, lineHeight: 1 }}>200+</div>
              <div style={{ fontSize: 12, fontWeight: 500, opacity: 0.85, marginTop: 2 }}>Looms Sold & Installed</div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <span className="section-label">About TXTILPROS</span>
            <h2 className="section-title">Building Textile<br />Industries Since 2014</h2>
            <p style={{ fontSize: 16, color: '#4a5568', lineHeight: 1.8, marginBottom: 20 }}>
              TXTILPROS is a specialized textile machinery company with deep roots in the South Indian weaving industry. We are authorized dealers of the renowned Red Flag Air Jet Loom brand.
            </p>
            <p style={{ fontSize: 16, color: '#4a5568', lineHeight: 1.8, marginBottom: 32 }}>
              Our internationally trained engineers provide end-to-end support — from project planning to installation, commissioning, and ongoing maintenance.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
              {[
                { title: '🎯 Mission', desc: 'To provide reliable textile machinery solutions with excellent after-sales service.' },
                { title: '🔭 Vision', desc: 'To become a leading textile solution provider across India.' },
                { title: '🤝 Commitment', desc: 'Honest pricing, genuine parts, and technical transparency.' },
                { title: '🏆 Excellence', desc: 'International training standards with local market knowledge.' },
              ].map((v, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 'var(--radius)', padding: 20, borderLeft: '3px solid var(--orange)', boxShadow: 'var(--shadow)' }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>{v.title}</h4>
                  <p style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.5 }}>{v.desc}</p>
                </div>
              ))}
            </div>
            <Link to="/contact" className="btn btn-primary">→ Get a Free Consultation</Link>
          </FadeUp>
          <style>{`@media(max-width:1024px){ .about-grid-resp { grid-template-columns:1fr !important; gap:40px !important; } }`}</style>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section style={{ background: 'var(--navy)', padding: '100px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <FadeUp>
            <span className="section-label" style={{ color: 'rgba(244,115,32,0.9)' }}>What We Do</span>
            <h2 className="section-title light">Our Services</h2>
            <p className="section-sub light">Comprehensive textile machinery services from installation to ongoing support.</p>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: 60 }} className="svc-grid-resp">
            {services.map((s, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '36px 28px', cursor: 'default', transition: 'background 0.3s' }}
                >
                  <div style={{ width: 56, height: 56, background: 'rgba(244,115,32,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, color: 'var(--orange)' }}>
                    {s.icon}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 22, color: 'white', letterSpacing: 1, marginBottom: 12 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{s.desc}</p>
                  <ul style={{ listStyle: 'none', marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {s.list.map((item, j) => (
                      <li key={j} style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: 'var(--orange)' }}>→</span> {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </FadeUp>
            ))}
          </div>
          <style>{`@media(max-width:1024px){ .svc-grid-resp { grid-template-columns:1fr 1fr !important; } } @media(max-width:640px){ .svc-grid-resp { grid-template-columns:1fr !important; } }`}</style>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section style={{ background: 'var(--white)', padding: '100px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="why-grid-resp">
          <FadeUp>
            <span className="section-label">Why TXTILPROS</span>
            <h2 className="section-title">Your Trusted<br />Textile Partner</h2>
            <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {whyItems.map((w, i) => (
                <div key={i} style={{ display: 'flex', gap: 20 }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 48, color: 'rgba(244,115,32,0.2)', letterSpacing: -2, lineHeight: 1, flexShrink: 0, width: 60 }}>{w.num}</div>
                  <div>
                    <h4 style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>{w.title}</h4>
                    <p style={{ fontSize: 14, color: 'var(--gray)', lineHeight: 1.7 }}>{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div style={{ background: 'var(--navy)', borderRadius: 20, padding: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {whyVisual.map((v, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 24, textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: 'var(--orange)', marginBottom: 12 }}>{v.icon}</div>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{v.label}</span>
                </div>
              ))}
            </div>
          </FadeUp>
          <style>{`@media(max-width:1024px){ .why-grid-resp { grid-template-columns:1fr !important; gap:40px !important; } }`}</style>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: 'var(--navy2)', padding: '100px 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <FadeUp>
            <span className="section-label" style={{ color: 'rgba(244,115,32,0.9)' }}>Client Reviews</span>
            <h2 className="section-title light">What Our Clients Say</h2>
          </FadeUp>
        </div>
        <div style={{ marginTop: 60, overflow: 'hidden' }}>
          <motion.div
            animate={{ x: [0, -50 + '%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'flex', gap: 24, width: 'max-content' }}
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 32, width: 360, flexShrink: 0 }}>
                <div style={{ color: 'var(--orange)', fontSize: 14, letterSpacing: 2, marginBottom: 16 }}>★★★★★</div>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 24 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontSize: 18, color: 'white' }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <div style={{ background: 'var(--orange)', padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(36px,4vw,56px)', color: 'white', letterSpacing: 2, marginBottom: 16 }}>
            READY TO UPGRADE YOUR WEAVING OPERATION?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, marginBottom: 36 }}>
            Get a free consultation with our textile machinery experts.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'white', color: 'var(--orange)', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14, transition: 'all 0.2s' }}>
              <FaPhone /> Call Us Today
            </Link>
            <a href="https://wa.me/919876543210" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.5)', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
              <FaWhatsapp /> WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
