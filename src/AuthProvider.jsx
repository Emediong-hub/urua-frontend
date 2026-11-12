import { useState } from 'react'
import { api } from './api'
import { AuthContext } from './auth-context'

function loadUser() {
  try {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)

  async function login(email, password) {
    const data = await api('/auth/login', { method: 'POST', body: { email, password } })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  // The account is created, but it can't log in until the emailed link is clicked
  async function register(form) {
    try {
      await api('/auth/register', { method: 'POST', body: form })
    } catch (err) {
      if (err.status === 409) {
        throw new Error(
          'That email is already registered. Try logging in, or use a different email.',
          { cause: err }
        )
      }
      throw err
    }
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}