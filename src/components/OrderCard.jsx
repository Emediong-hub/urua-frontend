import { formatDate, formatNaira, STATUS_LABELS } from '../format'

function OrderCard({ order, items, total, showAddress, note, actionLabel, onAction, busy }) {
  const address = order.shippingAddress

  return (
    <article className="order-card">
      <div className="order-head">
        <div>
          <p className="order-id">Order {order.id.slice(-8).toUpperCase()}</p>
          <p className="meta">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`badge badge-${order.status.toLowerCase()}`}>
          {STATUS_LABELS[order.status] || order.status}
        </span>
      </div>

      <div className="order-items">
        {items.map((item) => (
          <div key={item.productId} className="summary-row">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{formatNaira(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="summary-row summary-total">
          <span>Total</span>
          <span>{formatNaira(total)}</span>
        </div>
      </div>

      {showAddress && address && (
        <div className="order-address">
          <p className="order-address-title">Deliver to</p>
          <p>{address.fullName}</p>
          <p>{address.phone}</p>
          <p>
            {address.addressLine}, {address.city}, {address.state}
          </p>
        </div>
      )}

      {note && <p className="muted small">{note}</p>}

      {actionLabel && (
        <button className="btn" onClick={onAction} disabled={busy}>
          {busy ? 'Please wait...' : actionLabel}
        </button>
      )}
    </article>
  )
}

export default OrderCard