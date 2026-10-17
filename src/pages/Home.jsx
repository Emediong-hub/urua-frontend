import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../auth-context'
import ProductCard from '../components/ProductCard'
import { CATEGORIES } from '../constants'

const CATEGORY_ICONS = {
  Fashion: '👗',
  Electronics: '💻',
  Phones: '📱',
  'Home & Kitchen': '🍳',
  Beauty: '💄',
  'Food & Groceries': '🛒',
  Health: '🩺',
  Books: '📚',
  Other: '🛍️',
}

const TRUST = [
  { icon: '🔒', title: 'Secure payments', text: "Pay on Paystack's secure checkout" },
  { icon: '✅', title: 'You close the order', text: 'Confirm delivery when it arrives' },
  { icon: '🚚', title: 'Sellers across Nigeria', text: 'Small businesses from every state' },
  { icon: '📦', title: 'Track every order', text: 'From payment all the way to delivery' },
]

function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    api('/products?page=0&size=8')
      .then((data) => {
        if (!cancelled) setProducts(data.content)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    const q = search.trim()
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
  }

  return (
    <>
      <section className="landing-hero">
        <div className="container">
          <span className="hero-eyebrow">Nigeria's marketplace for small businesses</span>
          <h1>Buy and sell with confidence</h1>
          <p className="lead">
            Uruà connects small businesses to buyers across Nigeria, with secure
            payments and order tracking from checkout to delivery.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <input
              placeholder="What are you looking for?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn">Search</button>
          </form>
        </div>
      </section>

      <section className="trust">
        <div className="container trust-grid">
          {TRUST.map((item) => (
            <div key={item.title} className="trust-item">
              <div className="trust-icon">{item.icon}</div>
              <div>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2 className="section-title">Shop by category</h2>
        </div>
        <div className="category-grid">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to={`/products?category=${encodeURIComponent(c)}`}
              className="category-tile"
            >
              <span className="category-icon">{CATEGORY_ICONS[c] || '🛍️'}</span>
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2 className="section-title">Latest products</h2>
          <Link to="/products" className="btn btn-outline">
            View all products
          </Link>
        </div>

        {error && <div className="error">{error}</div>}

        {!products && !error && <p className="muted">Loading products...</p>}

        {products && products.length === 0 && (
          <p className="muted">No products have been listed yet.</p>
        )}

        {products && products.length > 0 && (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <div className="container">
        {!user ? (
          <div className="sell-cta">
            <h2>Own a business? Sell on Uruà</h2>
            <p>List your products for free and reach buyers across Nigeria.</p>
            <Link to="/register" className="btn">
              Start selling
            </Link>
          </div>
        ) : (
          <div className="page-end" />
        )}
      </div>
    </>
  )
}

export default Home