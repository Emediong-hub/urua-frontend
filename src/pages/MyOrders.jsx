import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import OrderCard from '../components/OrderCard'

function MyOrders() {
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  useEffect(() => {
    let cancelled = false

    api('/orders?page=0&size=20')
      .then((data) => {
        if (!cancelled) setResult(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function confirmDelivery(orderId) {
    setError('')
    setBusyId(orderId)
    try {
      const updated = await api(`/orders/${orderId}/confirm-delivery`, { method: 'POST' })
      setResult((prev) => ({
        ...prev,
        content: prev.content.map((o) => (o.id === updated.id ? updated : o)),
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="container page">
      <h2 className="page-title">My orders</h2>

      {error && <div className="error">{error}</div>}

      {!result && !error && <p className="muted">Loading your orders...</p>}

      {result && result.content.length === 0 && (
        <p className="muted">
          You haven't placed any orders yet. <Link to="/products">Browse products</Link>
        </p>
      )}

      {result && result.content.length > 0 && (
        <div className="order-list">
          {result.content.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              items={order.items}
              total={order.total}
              showAddress={true}
              note={
                order.status === 'PENDING_PAYMENT'
                  ? "Payment wasn't completed for this order."
                  : order.status === 'SHIPPED'
                    ? 'Your order is on its way. Confirm once it arrives.'
                    : ''
              }
              actionLabel={order.status === 'SHIPPED' ? 'Confirm delivery' : ''}
              onAction={() => confirmDelivery(order.id)}
              busy={busyId === order.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrders