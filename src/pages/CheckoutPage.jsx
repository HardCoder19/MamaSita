import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import { useCart } from '../context/CartContext'
import { createOrder } from '../lib/api'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { items, total, dispatch } = useCart()

  const [form, setForm] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Please fill in your name and email.')
      return
    }
    setLoading(true)
    setError(null)
    const { order, error: apiErr } = await createOrder(form, items)
    setLoading(false)

    if (apiErr) {
      setError('Something went wrong. Please try again.')
      console.error(apiErr)
      return
    }

    dispatch({ type: 'CLEAR_CART' })
    navigate('/order-status', { state: { orderId: order.id, total: order.total } })
  }

  return (
    <div className="min-h-screen pb-32 bg-background font-body text-on-background bg-dot-pattern">
      <TopAppBar showBack={true} backTo="/cart" />
      <main className="max-w-xl mx-auto px-6 py-24">
        <div className="mb-10 relative">
          <h2 className="font-display text-5xl uppercase text-on-background leading-none tracking-tight">CHECKOUT</h2>
          <div className="absolute -right-2 -top-4 bg-secondary border-[3px] border-outline p-1 -rotate-6 brutal-shadow">
            <span className="font-headline text-[10px] font-black uppercase px-2">
              {items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'}
            </span>
          </div>
        </div>

        {/* Step 1 — Your Details */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-primary text-white font-display text-xl w-8 h-8 flex items-center justify-center border-[3px] border-outline brutal-shadow">1</span>
            <h3 className="font-headline font-black text-2xl uppercase italic">YOUR DETAILS</h3>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block font-headline font-bold text-sm uppercase mb-1 ml-1">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-surface-bright border-[3px] border-outline p-4 font-headline font-bold focus:ring-0 focus:outline-none placeholder:text-stone-300 brutal-shadow transition-all focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none"
                placeholder="YOUR NAME"
                type="text"
              />
            </div>
            <div>
              <label className="block font-headline font-bold text-sm uppercase mb-1 ml-1">Email Address</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-surface-bright border-[3px] border-outline p-4 font-headline font-bold focus:ring-0 focus:outline-none placeholder:text-stone-300 brutal-shadow transition-all focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none"
                placeholder="YOU@EMAIL.COM"
                type="email"
              />
            </div>
          </div>
          {error && (
            <p className="mt-3 text-error font-bold text-sm font-headline uppercase">{error}</p>
          )}
        </section>

        {/* Step 2 — Payment */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-primary text-white font-display text-xl w-8 h-8 flex items-center justify-center border-[3px] border-outline brutal-shadow">2</span>
            <h3 className="font-headline font-black text-2xl uppercase italic">PAYMENT</h3>
          </div>
          <div className="bg-secondary border-[3px] border-outline p-5 brutal-shadow flex items-center justify-between -rotate-1">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-4xl">credit_card</span>
              <div>
                <p className="font-headline font-black text-lg leading-tight uppercase">Pay on Collection</p>
                <p className="font-body text-xs font-bold opacity-70">Cash or Card at Counter</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full border-[3px] border-outline bg-white flex items-center justify-center">
              <div className="w-4 h-4 bg-primary border-[2px] border-outline"></div>
            </div>
          </div>
        </section>

        {/* Order summary */}
        <div className="bg-white border-[3px] border-outline p-6 brutal-shadow rotate-1 mb-8">
          <h4 className="font-headline font-black border-b-[3px] border-outline pb-2 mb-4 uppercase">Order Summary</h4>
          <div className="space-y-2 font-body font-bold text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} {item.quantity > 1 ? `x${item.quantity}` : ''}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between text-primary mt-4 pt-2 border-t-[3px] border-dashed border-outline">
              <span>TOTAL (incl. tax)</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-surface-bright/80 backdrop-blur-md border-t-[3px] border-outline z-[60]">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#ef5b06] text-white py-5 px-8 brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-between group active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="font-display text-2xl uppercase tracking-wider">
            {loading ? 'PLACING ORDER...' : 'CONFIRM ORDER'}
          </span>
          <span className="font-display text-3xl">${total.toFixed(2)}</span>
          {!loading && <span className="material-symbols-outlined font-black text-3xl group-hover:translate-x-2 transition-transform">chevron_right</span>}
        </button>
      </div>
    </div>
  )
}

export default CheckoutPage
