import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth-context'

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'BUYER',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm({ ...form, [field]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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