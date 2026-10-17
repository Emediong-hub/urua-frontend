import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { formatNaira } from '../format'

function Cart() {
  const [cart, setCart] = useState(null)
  const [error, setError] = useState('')

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

  async function changeQuantity(productId, quantity) {
    setError('')
    try {
      setCart(
        await api('/cart/items', { method: 'PUT', body: { productId, quantity } })
      )
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(productId) {
    setError('')
    try {
      setCart(await api(`/cart/items/${productId}`, { method: 'DELETE' }))
    } catch (err) {
      setError(err.message)
    }
  }

  const allAvailable = cart && cart.items.every((item) => item.available)

  return (
    <div className="container page">
      <h2 className="page-title">Your cart</h2>

      {error && <div className="error">{error}</div>}

      {!cart && !error && <p className="muted">Loading your cart...</p>}

      {cart && cart.items.length === 0 && (
        <p className="muted">
          Your cart is empty. <Link to="/products">Browse products</Link>
        </p>
      )}

      {cart && cart.items.length > 0 && (
        <>
          <div className="cart-list">
            {cart.items.map((item) => (
              <div key={item.productId} className="cart-row">
                <div className="cart-thumb">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <span>{item.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <div className="cart-info">
                  <Link to={`/products/${item.productId}`} className="cart-name">
                    {item.name}
                  </Link>
                  <p className="price">{formatNaira(item.price)}</p>
                  {!item.available && (
                    <p className="stock">
                      Not available in this quantity. Change it or remove it.
                    </p>
                  )}
                </div>

                <div className="cart-controls">
                  <div className="qty">
                    <button
                      onClick={() => changeQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => changeQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stockAvailable}
                    >
                      +
                    </button>
                  </div>
                  <p className="line-total">{formatNaira(item.lineTotal)}</p>
                  <button className="link-btn" onClick={() => remove(item.productId)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <p>
              Subtotal ({cart.totalItems} item{cart.totalItems === 1 ? '' : 's'})
            </p>
            <p className="subtotal">{formatNaira(cart.subtotal)}</p>
            {allAvailable ? (
              <Link to="/checkout" className="btn btn-block">
                Proceed to checkout
              </Link>
            ) : (
              <button className="btn btn-block" disabled>
                Fix unavailable items to continue
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Cart