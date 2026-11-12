import { useEffect, useState } from 'react'
import { api } from '../api'

function ResendVerification({ email }) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (seconds <= 0) return
    const timer = setTimeout(() => setSeconds(seconds - 1), 1000)
    return () => clearTimeout(timer)
  }, [seconds])

  async function resend() {
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const data = await api('/auth/resend-verification', {
        method: 'POST',
        body: { email },
      })
      setMessage(data.message)
      setSeconds(60)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  let label = 'Resend verification email'
  if (loading) label = 'Sending...'
  if (seconds > 0) label = `Resend available in ${seconds}s`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}
      <button
        type="button"
        className="btn btn-outline btn-block"
        onClick={resend}
        disabled={loading || seconds > 0 || !email}
      >
        {label}
      </button>
    </div>
  )
}

export default ResendVerification