import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'

// Customer pages
import HomePage         from './pages/HomePage'
import BuildBasePage    from './pages/BuildBasePage'
import BuildProteinPage from './pages/BuildProteinPage'
import BuildSaucePage   from './pages/BuildSaucePage'
import CartPage         from './pages/CartPage'
import CheckoutPage     from './pages/CheckoutPage'
import OrderStatusPage  from './pages/OrderStatusPage'
import ProfilePage      from './pages/ProfilePage'

// Admin pages
import AdminLoginPage   from './pages/admin/AdminLoginPage'
import CounterPage      from './pages/admin/CounterPage'
import CookPage         from './pages/admin/CookPage'
import AdminProtectedRoute from './components/admin/AdminProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Customer app ───────────────────────── */}
        <Route path="/"              element={<HomePage />} />
        <Route path="/build-base"    element={<BuildBasePage />} />
        <Route path="/build-protein" element={<BuildProteinPage />} />
        <Route path="/build-sauce"   element={<BuildSaucePage />} />
        <Route path="/cart"          element={<CartPage />} />
        <Route path="/checkout"      element={<CheckoutPage />} />
        <Route path="/order-status"  element={<OrderStatusPage />} />
        <Route path="/profile"       element={<ProfilePage />} />

        {/* ── Admin portal ───────────────────────── */}
        <Route path="/admin"         element={<Navigate to="/admin/counter" replace />} />
        <Route path="/admin/login"   element={<AdminLoginPage />} />
        <Route path="/admin/counter" element={<AdminProtectedRoute><CounterPage /></AdminProtectedRoute>} />
        <Route path="/admin/cook"    element={<AdminProtectedRoute><CookPage /></AdminProtectedRoute>} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  )
}

export default App
