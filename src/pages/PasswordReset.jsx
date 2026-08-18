import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import Footer from '../components/Footer'
import { apiRequest } from '../features/reporting/api'

function PasswordShell({ children, lead, title }) {
  return <><Toaster position="top-right" /><div className="login-shell"><section className="login-panel glass-card"><div className="eyebrow">TXTILPROS account access</div><h1>{title}</h1><p className="lead">{lead}</p>{children}</section></div><Footer /></>
}

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  async function handleSubmit(event) {
    event.preventDefault(); setLoading(true)
    try { const data = await apiRequest('/auth/forgot-password', { method: 'POST', body: { email } }); toast.success(data.message) } catch (error) { toast.error(error.message) } finally { setLoading(false) }
  }
  return <PasswordShell title="Forgot password" lead="Enter your account email and we’ll send you a link to reset your password."><form className="stack-lg" onSubmit={handleSubmit}><label className="field"><span>Email</span><input autoComplete="email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><button className="primary-button" disabled={loading} type="submit">{loading ? 'Sending link...' : 'Send reset link'}</button><Link className="login-help-link" to="/login">Back to login</Link></form></PasswordShell>
}

export function ResetPassword() {
  const [searchParams] = useSearchParams(); const navigate = useNavigate(); const [password, setPassword] = useState(''); const [confirmPassword, setConfirmPassword] = useState(''); const [loading, setLoading] = useState(false); const token = searchParams.get('token') || ''
  async function handleSubmit(event) {
    event.preventDefault(); if (!token) return toast.error('This reset link is missing its token. Please request a new one.'); if (password !== confirmPassword) return toast.error('The passwords do not match.'); setLoading(true)
    try { const data = await apiRequest('/auth/reset-password', { method: 'POST', body: { token, password } }); toast.success(data.message); navigate('/login', { replace: true }) } catch (error) { toast.error(error.message) } finally { setLoading(false) }
  }
  return <PasswordShell title="Set a new password" lead="Choose a new password with at least 8 characters."><form className="stack-lg" onSubmit={handleSubmit}><label className="field"><span>New password</span><input autoComplete="new-password" minLength="8" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label><label className="field"><span>Confirm new password</span><input autoComplete="new-password" minLength="8" required type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label><button className="primary-button" disabled={loading || !token} type="submit">{loading ? 'Resetting password...' : 'Reset password'}</button><Link className="login-help-link" to="/login">Back to login</Link></form></PasswordShell>
}
