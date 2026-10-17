import { useEffect, useState } from 'react'
import { api } from '../api'
import { useAuth } from '../auth-context'
import OrderCard from '../components/OrderCard'

function SellerOrders() {
  const { user } = useAuth()
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  useEffect(() => {
    let cancelled = false

    api('/seller/orders?page=0&size=20')
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

  async function ship(orderId) {
    setError('')
    setBusyId(orderId)
    try {
      const updated = await api(`/seller/orders/${orderId}/ship`, { method: 'PUT' })
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
      <h2 className="page-title">Orders for my products</h2>

      {error && <div className="error">{error}</div>}

      {!result && !error && <p className="muted">Loading orders...</p>}

      {result && result.content.length === 0 && (
        <p className="muted">No paid orders yet. They'll show up here once buyers pay.</p>
      )}

      {result && result.content.length > 0 && (
        <div className="order-list">
          {result.content.map((order) => {
            const mine = order.items.filter((item) => item.sellerId === user.id)
            const total = mine.reduce((sum, item) => sum + item.price * item.quantity, 0)

            return (
              <OrderCard
                key={order.id}
                order={order}
                items={mine}
                total={total}
                showAddress={true}
                note={order.status === 'PAID' ? 'Paid. Please ship this order.' : ''}
                actionLabel={order.status === 'PAID' ? 'Mark as shipped' : ''}
                onAction={() => ship(order.id)}
                busy={busyId === order.id}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SellerOrders