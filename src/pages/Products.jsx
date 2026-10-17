import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api'
import ProductCard from '../components/ProductCard'
import { CATEGORIES, NIGERIAN_STATES } from '../constants'

function ProductList({ filters }) {
  const [, setSearchParams] = useSearchParams()
  const [form, setForm] = useState(filters)
  const [page, setPage] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const params = new URLSearchParams({ page, size: 12 })
    if (filters.q) params.set('q', filters.q)
    if (filters.category) params.set('category', filters.category)
    if (filters.state) params.set('state', filters.state)

    api(`/products?${params}`)
      .then((data) => {
        if (!cancelled) {
          setResult(data)
          setError('')
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [filters.q, filters.category, filters.state, page])

  function handleSearch(e) {
    e.preventDefault()
    const next = {}
    if (form.q.trim()) next.q = form.q.trim()
    if (form.category) next.category = form.category
    if (form.state) next.state = form.state
    setPage(0)
    setSearchParams(next)
  }

  function handleClear() {
    setPage(0)
    setSearchParams({})
  }

  return (
    <div className="container page">
      <h2 className="page-title">
        {filters.category ? filters.category : 'Browse products'}
      </h2>

      <form className="filters" onSubmit={handleSearch}>
        <input
          className="filter-search"
          placeholder="Search products..."
          value={form.q}
          onChange={(e) => setForm({ ...form, q: e.target.value })}
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        >
          <option value="">All states</option>
          {NIGERIAN_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button className="btn">Search</button>
        <button type="button" className="btn btn-outline" onClick={handleClear}>
          Clear
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {!result && !error && <p className="muted">Loading products...</p>}

      {result && result.content.length === 0 && (
        <p className="muted">No products found. Try a different search.</p>
      )}

      {result && result.content.length > 0 && (
        <>
          <p className="muted">{result.totalElements} product(s) found</p>
          <div className="product-grid">
            {result.content.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="pagination">
            <button
              className="btn btn-outline"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span>
              Page {result.page + 1} of {Math.max(result.totalPages, 1)}
            </span>
            <button
              className="btn btn-outline"
              disabled={page + 1 >= result.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function Products() {
  const [searchParams] = useSearchParams()

  const filters = {
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    state: searchParams.get('state') || '',
  }

  // The key restarts the list whenever the search in the address changes
  return <ProductList key={searchParams.toString()} filters={filters} />
}

export default Products