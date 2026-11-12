import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api'

// React runs effects twice in development. Sharing one request per token stops
// the second run from using up the one-time link before the first can show success.
const attempts = new Map()

function verifyOnce(token) {
  if (!attempts.has(token)) {
    attempts.set(
      token,
      api('/auth/verify-email', { method: 'POST', body: { token } })
    )
  }
  return attempts.get(token)
}

function VerifyEmail() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [state, setState] = useState({ status: 'loading', message: '' })

  useEffect(() => {
    if (!token) return

    let cancelled = false

    verifyOnce(token)
      .then((data) => {
        if (!cancelled) setState({ status: 'success', message: data.message })
      })
      .catch((err) => {
        if (!cancelled) setState({ status: 'error', message: err.message })
      })

    return () => {
      cancelled = true
    }
  }, [token])

  let content

  if (!token) {
    content = (
      <>
        <h2>Link not complete</h2>
        <p className="muted">
          This page needs the link from your verification email. Open the email
          and click the button there.
        </p>
        <Link to="/login" className="btn">
          Go to login
        </Link>
      </>
    )
  } else if (state.status === 'loading') {
    content = (
      <>
        <h2>Verifying your email...</h2>
        <p className="muted">Please wait a moment.</p>
      </>
    )
  } else if (state.status === 'success') {
    content = (
      <>
        <h2 className="paid-title">Email verified</h2>
        <p>{state.message}</p>
        <Link to="/login" className="btn">
          Login
        </Link>
      </>
    )
  } else {
    content = (
      <>
        <h2>We couldn't verify your email</h2>
        <div className="error">{state.message}</div>
        <p className="muted">
          If you already verified, just log in. If not, log in and use the resend
          button to get a fresh link.
        </p>
        <Link to="/login" className="btn">
          Go to login
        </Link>
      </>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">{content}</div>
    </div>
  )
}

export default VerifyEmail