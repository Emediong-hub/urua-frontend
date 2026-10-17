const API_URL = 'http://localhost:8080/api'

// One helper for every call to the backend.
// It adds the login token automatically and turns errors into readable messages.
export async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = localStorage.getItem('token')
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Cannot reach the server. Please check your connection.')
  }

  const text = await response.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }

  if (!response.ok) {
    const firstDetail =
      data && Array.isArray(data.errors) && data.errors[0] && data.errors[0].defaultMessage
    const error = new Error(
      firstDetail || (data && data.message) || `Something went wrong (${response.status})`
    )
    error.status = response.status
    throw error
  }

  return data
}