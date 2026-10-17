import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import RequireRole from './components/RequireRole'
import AddProduct from './pages/AddProduct'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Home from './pages/Home'
import Login from './pages/Login'
import MyOrders from './pages/MyOrders'
import MyProducts from './pages/MyProducts'
import PaymentCallback from './pages/PaymentCallback'
import ProductDetail from './pages/ProductDetail'
import Products from './pages/Products'
import Register from './pages/Register'
import SellerOrders from './pages/SellerOrders'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/cart"
          element={
            <RequireRole role="BUYER">
              <Cart />
            </RequireRole>
          }
        />
        <Route
          path="/checkout"
          element={
            <RequireRole role="BUYER">
              <Checkout />
            </RequireRole>
          }
        />
        <Route
          path="/payment/callback"
          element={
            <RequireRole role="BUYER">
              <PaymentCallback />
            </RequireRole>
          }
        />
        <Route
          path="/orders"
          element={
            <RequireRole role="BUYER">
              <MyOrders />
            </RequireRole>
          }
        />
        <Route
          path="/sell"
          element={
            <RequireRole role="SELLER">
              <AddProduct />
            </RequireRole>
          }
        />
        <Route
          path="/my-products"
          element={
            <RequireRole role="SELLER">
              <MyProducts />
            </RequireRole>
          }
        />
        <Route
          path="/seller/orders"
          element={
            <RequireRole role="SELLER">
              <SellerOrders />
            </RequireRole>
          }
        />
      </Routes>
    </>
  )
}

export default App