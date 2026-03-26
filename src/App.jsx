import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import HomePage from './pages/HomePage'
import BuildBasePage from './pages/BuildBasePage'
import BuildProteinPage from './pages/BuildProteinPage'
import BuildSaucePage from './pages/BuildSaucePage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderStatusPage from './pages/OrderStatusPage'
import ProfilePage from './pages/ProfilePage'
import TopAppBar from './components/TopAppBar'
import BottomNav from './components/BottomNav'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/build-base" element={<BuildBasePage />} />
        <Route path="/build-protein" element={<BuildProteinPage />} />
        <Route path="/build-sauce" element={<BuildSaucePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-status" element={<OrderStatusPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  )
}

export default App
