import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane, FaWhatsapp } from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://txtilepros-backend.vercel.app/api'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`${API_URL}/contact`, form)
      toast.success('Message sent! We\'ll respond within 24 hours.')
      setForm({ name: '', phone: '', email: '', subject: '', message: '' })
    } catch {
      toast.error('Failed to send. Please call us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Page Hero */}
      <div style={{
        background: 'var(--navy)', padding: '140px 32px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.02) 50px, rgba(255,255,255,0.02) 51px), repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.02) 50px, rgba(255,255,255,0.02) 51px)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Home</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>›</span>
            <span style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 600 }}>Contact</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(48px,5vw,72px)', color: 'white', letterSpacing: 3, lineHeight: 1 }}>CONTACT US</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 17, marginTop: 16, lineHeight: 1.6 }}>Our experts are ready to assist with machine purchase, service, or any technical inquiry.</p>
        </div>
      </div>

      {/* Contact Section */}
      <section style={{ background: 'var(--navy)', padding: '80px 32px 100px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 60 }} className="contact-resp">

            {/* Info */}
            <div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
                Whether you're planning a new weaving unit, expanding your existing operation, or need urgent machine support — we're just a call away.
              </p>
              {[
                { icon: <FaMapMarkerAlt />, title: 'Address', content: 'TXTILPROS Machinery Solutions\nCoimbatore, Tamil Nadu, India' },
                { icon: <FaPhone />, title: 'Phone', content: '+91 98765 43210' },
                { icon: <FaEnvelope />, title: 'Email', content: 'info@txtilpros.com' },
                { icon: <FaClock />, title: 'Working Hours', content: 'Mon – Sat: 9:00 AM – 6:00 PM\nEmergency: 24/7' },
              ].map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 28 }}>
                  <div style={{ width: 48, height: 48, background: 'rgba(244,115,32,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--orange)', fontSize: 18 }}>
                    {d.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{d.title}</h4>
                    <p style={{ fontSize: 15, color: 'white', fontWeight: 500, whiteSpace: 'pre-line' }}>{d.content}</p>
                  </div>
                </div>
              ))}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 32, gap: 12, color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
                <FaMapMarkerAlt size={24} />
                <span>Google Maps — Coimbatore, Tamil Nadu</span>
              </div>
            </div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 40 }}
            >
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 28, color: 'white', letterSpacing: 1, marginBottom: 28 }}>SEND US A MESSAGE</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form-row-resp">
                {[
                  { name: 'name', label: 'Full Name', placeholder: 'Your name', type: 'text' },
                  { name: 'phone', label: 'Phone', placeholder: '+91 98765 43210', type: 'tel' },
                ].map(f => (
                  <div key={f.name}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{f.label}</label>
                    <input
                      type={f.type} name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} required
                      style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '13px 16px', color: 'white', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none' }}
                    />
                  </div>
                ))}
              </div>

              {[
                { name: 'email', label: 'Email', placeholder: 'your@email.com', type: 'email' },
              ].map(f => (
                <div key={f.name} style={{ marginTop: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{f.label}</label>
                  <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} required
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '13px 16px', color: 'white', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none' }}
                  />
                </div>
              ))}

              <div style={{ marginTop: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Subject</label>
                <select name="subject" value={form.subject} onChange={handleChange}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '13px 16px', color: 'white', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', cursor: 'pointer' }}
                >
                  <option value="" disabled>Select inquiry type</option>
                  <option value="purchase">Machine Purchase Inquiry</option>
                  <option value="service">Service / Repair Request</option>
                  <option value="parts">Spare Parts Order</option>
                  <option value="project">Project Consultation</option>
                  <option value="support">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{ marginTop: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={5} required placeholder="Tell us about your requirement..."
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '13px 16px', color: 'white', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, flexWrap: 'wrap', gap: 12 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>We respond within 24 hours</span>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 8, background: 'var(--orange)', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, opacity: loading ? 0.7 : 1 }}
                >
                  <FaPaperPlane /> {loading ? 'Sending...' : 'Send Message'}
                </motion.button>
              </div>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Quick contact strip */}
      <div style={{ background: 'var(--orange)', padding: '40px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 28, color: 'white', letterSpacing: 1 }}>NEED URGENT SUPPORT?</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, marginTop: 4 }}>Our engineers are available 24/7 for emergency breakdowns</div>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href="tel:+919876543210" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'white', color: 'var(--orange)', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
              <FaPhone /> Call Now
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14, border: '2px solid rgba(255,255,255,0.3)' }}>
              <FaWhatsapp /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .contact-resp { grid-template-columns: 1fr !important; } }
        @media (max-width: 640px) { .form-row-resp { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}
