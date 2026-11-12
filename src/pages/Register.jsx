import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth-context'
import ResendVerification from '../components/ResendVerification'

function Register() {
  const { register } = useAuth()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'BUYER',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sentTo, setSentTo] = useState('')

  function update(field, value) {
    setForm({ ...form, [field]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      setSentTo(form.email.trim().toLowerCase())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (sentTo) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>Check your email</h2>
          <p>
            We sent a verification link to <strong>{sentTo}</strong>. Click it to
            activate your account. The link expires in 24 hours.
          </p>
          <p className="muted small">
            Can't find it? Look in your spam folder, or request a new one below.
          </p>
          <ResendVerification email={sentTo} />
          <p className="switch">
            Already verified? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create your account</h2>

        {error && <div className="error">{error}</div>}

        <div className="role-choice">
          <button
            type="button"
            className={form.role === 'BUYER' ? 'role active' : 'role'}
            onClick={() => update('role', 'BUYER')}
          >
            I want to buy
          </button>
          <button
            type="button"
            className={form.role === 'SELLER' ? 'role active' : 'role'}
            onClick={() => update('role', 'SELLER')}
          >
            I want to sell
          </button>
        </div>

        <label className="field">
          Full name
          <input
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            required
          />
        </label>

        <label className="field">
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
          />
        </label>

        <label className="field">
          Phone number
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </label>

        <label className="field">
          Password (at least 8 characters)
          <input
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            required
          />
        </label>

        <button className="btn btn-block" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}

export default Register