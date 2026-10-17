import { Link } from 'react-router-dom'
import { formatNaira } from '../format'

function ProductCard({ product }) {
  const image = product.imageUrls && product.imageUrls[0]

  let stockText = ''
  if (product.stockQuantity === 0) {
    stockText = 'Out of stock'
  } else if (product.stockQuantity <= 5) {
    stockText = `Only ${product.stockQuantity} left`
  }

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image">
        {image ? (
          <img src={image} alt={product.name} />
        ) : (
          <span>{product.name.charAt(0).toUpperCase()}</span>
        )}
      </div>
      <div className="product-body">
        {product.category && <span className="cat-badge">{product.category}</span>}
        <h3>{product.name}</h3>
        <p className="price">{formatNaira(product.price)}</p>
        <p className="meta">
          {product.sellerName} · {product.state}
        </p>
        {stockText && <p className="stock">{stockText}</p>}
      </div>
    </Link>
  )
}

export default ProductCard