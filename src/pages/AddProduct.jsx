import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { CATEGORIES, NIGERIAN_STATES } from '../constants'

function AddProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: CATEGORIES[0],
    stockQuantity: '1',
    state: 'Lagos',
    imageUrl: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm({ ...form, [field]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api('/products', {
        method: 'POST',
        body: {
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          category: form.category,
          stockQuantity: Number(form.stockQuantity),
          state: form.state,
          imageUrls: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
        },
      })
      navigate('/my-products')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card wide" onSubmit={handleSubmit}>
        <h2>Add a product</h2>

        {error && <div className="error">{error}</div>}

        <label className="field">
          Product name
          <input
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
          />
        </label>

        <label className="field">
          Description
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            required
          />
        </label>

        <div className="form-row">
          <label className="field">
            Price (₦)
            <input
              type="number"
              min="1"
              step="any"
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
              required
            />
          </label>

          <label className="field">
            Quantity in stock
            <input
              type="number"
              min="0"
              step="1"
              value={form.stockQuantity}
              onChange={(e) => update('stockQuantity', e.target.value)}
              required
            />
          </label>
        </div>

        <div className="form-row">
          <label className="field">
            Category
            <select
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            Ships from
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

        <label className="field">
          Image link (optional)
          <input
            type="url"
            placeholder="https://..."
            value={form.imageUrl}
            onChange={(e) => update('imageUrl', e.target.value)}
          />
        </label>

        <button className="btn btn-block" disabled={loading}>
          {loading ? 'Saving...' : 'Add product'}
        </button>
      </form>
    </div>
  )
}

export default AddProduct