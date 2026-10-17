import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api'
import { formatNaira } from '../format'

function PaymentCallback() {
  const [params] = useSearchParams()
  const reference = params.get('reference') || params.get('trxref')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!reference) return

    let cancelled = false

    // The server asks Paystack directly whether the payment really happened
    api(`/orders/verify/${reference}`, { method: 'POST' })
      .then((data) => {
        if (!cancelled) setOrder(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [reference])

  let content

  if (!reference) {
    content = (
      <>
        <h2>Nothing to verify</h2>
        <p className="muted">We couldn't find a payment reference.</p>
        <Link to="/products" className="btn">
          Continue shopping
        </Link>
      </>
    )
  } else if (error) {
    content = (
      <>
        <h2>We couldn't confirm your payment</h2>
        <div className="error">{error}</div>
        <p className="muted">
          If money left your account, don't pay again. Refresh this page in a
          moment to check again.
        </p>
      </>
    )
  } else if (!order) {
    content = (
      <>
        <h2>Confirming your payment...</h2>
        <p className="muted">Please wait, this only takes a moment.</p>
      </>
    )
  } else if (order.status === 'PENDING_PAYMENT') {
    content = (
      <>
        <h2>Payment not completed</h2>
        <p className="muted">
          We didn't receive a successful payment for this order. Nothing was
          charged.
        </p>
        <Link to="/cart" className="btn">
          Back to cart
        </Link>
      </>
    )
  } else {
    content = (
      <>
        <h2 className="paid-title">Payment successful</h2>
        <p>
          Thank you! Your order is confirmed, and the seller has been notified to
          ship it.
        </p>
        <div className="summary">
          <div className="summary-row">
            <span>Order number</span>
            <span className="small-id">{order.id}</span>
          </div>
          <div className="summary-row">
            <span>Status</span>
            <span>{order.status}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total paid</span>
            <span>{formatNaira(order.total)}</span>
          </div>
        </div>
        <Link to="/products" className="btn">
          Continue shopping
        </Link>
      </>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card wide">{content}</div>
    </div>
  )
}

export default PaymentCallback