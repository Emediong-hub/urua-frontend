import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../auth-context'
import { NIGERIAN_STATES } from '../constants'
import { formatNaira } from '../format'

function Checkout() {
  const { user } = useAuth()
  const [cart, setCart] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    fullName: user.fullName,
    phone: user.phone || '',
    addressLine: '',
    city: '',
    state: 'Lagos',
  })

  useEffect(() => {
    let cancelled = false

    api('/cart')
      .then((data) => {
        if (!cancelled) setCart(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [])

  function update(field, value) {
    setForm({ ...form, [field]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api('/orders/checkout', {
        method: 'POST',
        body: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          addressLine: form.addressLine.trim(),
          city: form.city.trim(),
          state: form.state,
        },
      })
      // Send the buyer to Paystack's secure payment page
      window.location.href = data.paymentUrl
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (!cart && !error) {
    return (
      <div className="container page">
        <p className="muted">Loading checkout...</p>
      </div>
    )
  }

  if (cart && cart.items.length === 0) {
    return (
      <div className="container page">
        <p className="muted">
          Your cart is empty. <Link to="/products">Browse products</Link>
        </p>
      </div>
    )
  }

  const blocked = cart && cart.items.some((item) => !item.available)

  return (
    <div className="auth-page">
      <form className="auth-card wide" onSubmit={handleSubmit}>
        <h2>Checkout</h2>

        {error && <div className="error">{error}</div>}

        {cart && (
          <div className="summary">
            {cart.items.map((item) => (
              <div key={item.productId} className="summary-row">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatNaira(item.lineTotal)}</span>
              </div>
            ))}
            <div className="summary-row summary-total">
              <span>Subtotal</span>
              <span>{formatNaira(cart.subtotal)}</span>
            </div>
            <p className="muted small">
              Any delivery fee is added to the total you see on the payment page.
            </p>
          </div>
        )}

        {blocked && (
          <div className="error">
            Some items in your cart are no longer available in that quantity.{' '}
            <Link to="/cart">Review your cart</Link>
          </div>
        )}

        <h3 className="section-title">Delivery address</h3>

        <label className="field">
          Full name
          <input
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            required
          />
        </label>

        <label className="field">
          Phone number
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            required
          />
        </label>

        <label className="field">
          Street address
          <input
            value={form.addressLine}
            onChange={(e) => update('addressLine', e.target.value)}
            required
          />
        </label>

        <div className="form-row">
          <label className="field">
            City
            <input
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              required
            />
          </label>

          <label className="field">
            State
            <select
              value={form.state}
              onChange={(e) => update('state', e.target.value)}
            >
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button className="btn btn-block" disabled={loading || blocked}>
          {loading ? 'Taking you to payment...' : 'Place order and pay'}
        </button>
      </form>
    </div>
  )
}

export default Checkout