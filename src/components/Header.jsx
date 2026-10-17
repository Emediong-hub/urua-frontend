import { Link } from 'react-router-dom'
import { useAuth } from '../auth-context'

function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="header">
      <div className="container">
        <Link to="/">
          <img src="/logo.png" alt="Uruà" className="logo" />
        </Link>

        <nav className="nav">
          <Link to="/products" className="nav-link">
            Products
          </Link>

          {user && user.role === 'BUYER' && (
            <>
              <Link to="/cart" className="nav-link">
                Cart
              </Link>
              <Link to="/orders" className="nav-link">
                My orders
              </Link>
            </>
          )}

          {user && user.role === 'SELLER' && (
            <>
              <Link to="/my-products" className="nav-link">
                My products
              </Link>
              <Link to="/seller/orders" className="nav-link">
                Orders
              </Link>
              <Link to="/sell" className="nav-link">
                Sell
              </Link>
            </>
          )}

          {user ? (
            <>
              <span className="hello">Hi, {user.fullName.split(' ')[0]}</span>
              <button className="btn btn-outline" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header