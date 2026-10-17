import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../auth-context'
import { formatNaira } from '../format'

function ProductDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [actionError, setActionError] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    let cancelled = false

    api(`/products/${id}`)
      .then((data) => {
        if (!cancelled) setProduct(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  async function addToCart() {
    setMessage('')
    setActionError('')
    setAdding(true)
    try {
      await api('/cart/items', {
        method: 'POST',
        body: { productId: product.id, quantity },
      })
      setMessage(`Added ${quantity} to your cart.`)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setAdding(false)
    }
  }

  if (error) {
    return (
      <div className="container page">
        <div className="error">{error}</div>
        <p className="muted">
          <Link to="/products">Back to products</Link>
        </p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container page">
        <p className="muted">Loading product...</p>
      </div>
    )
  }

  const image = product.imageUrls && product.imageUrls[0]

  let buyArea
  if (product.stockQuantity === 0) {
    buyArea = <p className="stock">Out of stock</p>
  } else if (!user) {
    buyArea = (
      <Link to="/login" className="btn">
        Login to buy
      </Link>
    )
  } else if (user.role !== 'BUYER') {
    buyArea = (
      <p className="muted">Seller accounts can't buy. Log in with a buyer account.</p>
    )
  } else {
    buyArea = (
      <>
        <label className="field qty-field">
          Quantity
          <input
            type="number"
            min="1"
            max={product.stockQuantity}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>
        <button className="btn" onClick={addToCart} disabled={adding}>
          {adding ? 'Adding...' : 'Add to cart'}
        </button>
      </>
    )
  }

  return (
    <div className="container page">
      <p className="muted">
        <Link to="/products">← Back to products</Link>
      </p>

      <div className="detail">
        <div className="detail-image">
          {image ? (
            <img src={image} alt={product.name} />
          ) : (
            <span>{product.name.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div>
          <h2 className="page-title">{product.name}</h2>
          <p className="detail-price">{formatNaira(product.price)}</p>
          <p className="meta">
            Sold by {product.sellerName} · Ships from {product.state}
          </p>
          <p className="meta">Category: {product.category}</p>
          {product.stockQuantity > 0 && (
            <p className="meta">{product.stockQuantity} in stock</p>
          )}

          <p className="detail-description">{product.description}</p>

          {message && (
            <div className="success">
              {message} <Link to="/cart">View cart</Link>
            </div>
          )}
          {actionError && <div className="error">{actionError}</div>}

          <div className="buy-area">{buyArea}</div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail