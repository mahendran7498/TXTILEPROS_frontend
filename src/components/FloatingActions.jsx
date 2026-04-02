import { FaWhatsapp, FaPhone } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function FloatingActions() {
  return (
    <div style={{
      position: 'fixed', bottom: 32, right: 24, zIndex: 900,
      display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end'
    }}>
      <motion.a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 20px', borderRadius: 100,
          background: '#25d366', color: 'white', textDecoration: 'none',
          fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
          boxShadow: '0 4px 20px rgba(37,211,102,0.4)'
        }}
      >
        <FaWhatsapp size={18} />
        <span className="float-label">WhatsApp</span>
      </motion.a>
      <motion.a
        href="tel:+919876543210"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 20px', borderRadius: 100,
          background: 'var(--orange)', color: 'white', textDecoration: 'none',
          fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
          boxShadow: '0 4px 20px rgba(244,115,32,0.4)'
        }}
      >
        <FaPhone size={16} />
        <span className="float-label">Call Now</span>
      </motion.a>
      <style>{`
        @media (max-width: 768px) {
          .float-label { display: none; }
          a[href^="https://wa.me"], a[href^="tel:"] { padding: 14px !important; border-radius: 50% !important; }
        }
      `}</style>
    </div>
  )
}
