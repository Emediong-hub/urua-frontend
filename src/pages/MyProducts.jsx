import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import ProductCard from '../components/ProductCard'

function MyProducts() {
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    api('/products/mine?page=0&size=50')
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

  return (
    <div className="container page">
      <div className="page-head">
        <h2 className="page-title">My products</h2>
        <Link to="/sell" className="btn">
          Add product
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {!result && !error && <p className="muted">Loading your products...</p>}

      {result && result.content.length === 0 && (
        <p className="muted">You haven't listed anything yet.</p>
      )}

      {result && result.content.length > 0 && (
        <>
          <p className="muted">{result.totalElements} product(s) listed</p>
          <div className="product-grid">
            {result.content.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default MyProducts