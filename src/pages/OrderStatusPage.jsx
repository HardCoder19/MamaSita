import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import BottomNav from '../components/BottomNav'
import { getOrder } from '../lib/api'

const STATUS_STEPS = ['received', 'prepping', 'cooking', 'ready']
const STATUS_LABELS = { received: 'Received', prepping: 'Prepping', cooking: 'Cooking', ready: 'Ready!' }

const OrderStatusPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const orderId = location.state?.orderId
  const passedTotal = location.state?.total

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return
    getOrder(orderId).then(({ order: o }) => {
      setOrder(o)
      setLoading(false)
    })
  }, [orderId])

  const stepIdx    = order ? STATUS_STEPS.indexOf(order.status) : 0
  const progressPct = Math.round(((stepIdx + 1) / STATUS_STEPS.length) * 100)

  if (!orderId) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-body bg-dot-pattern">
        <TopAppBar />
        <p className="font-headline font-bold text-xl uppercase mt-20">No order found.</p>
        <button onClick={() => navigate('/')} className="mt-6 bg-primary text-white font-headline font-bold px-8 py-3 border-[3px] border-outline brutal-shadow uppercase">
          Back to Menu
        </button>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-on-background font-body flex flex-col bg-dot-pattern">
      <TopAppBar />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-24">
        <div className="max-w-2xl mx-auto space-y-8">
          <section className="bg-surface-variant border-[3px] border-outline p-6 brutal-shadow relative overflow-hidden">
            <div className="absolute -top-4 -right-4 bg-primary text-white p-4 rotate-12 border-2 border-outline z-10">
              <span className="font-display text-sm">#{order?.id?.slice(0, 6).toUpperCase() ?? '------'}</span>
            </div>
            <div className="relative z-0 mb-6 border-b-[3px] border-outline -mx-6 -mt-6 aspect-video">
              <img alt="Taco Food Truck" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfT1WFrzW5JIZZunKnQygMB3n3qVliFepY4Gp7wKOrqRXwTxVCoqgZ8MZj3qxaKqDDf0JNBbluKZCVCCRaTPqv7ZYvApLX0mhGRueZpySTkHpBIXbFOKN4w2ru1S1ZFp6YS1H9hRE71x1KhsA8IVgftvaZpBmLoyMPXdVsZmg35Kauoq55t_puLpnl4rPoHIm2SA93eyn3y9XEDx4rfOMeFGK7LkK2O2o6wsEYG5FaTbkSLei1LdbqihV9Qxkb8OZzASzhyDyLCak"/>
            </div>
            <div className="text-center space-y-2">
              <h2 className="font-display text-5xl md:text-6xl text-primary uppercase tracking-normal leading-tight">
                {loading ? 'LOADING...' : "WE'RE COOKING!"}
              </h2>
              <p className="font-headline font-bold text-xl uppercase italic">
                {loading ? 'Fetching your order...' : 'Estimated wait: 15–20 minutes'}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-end">
                <span className="font-headline font-black text-xs uppercase tracking-widest px-2 py-1 bg-on-background text-white">Progress</span>
                <span className="font-display text-2xl text-secondary">{progressPct}%</span>
              </div>
              <div className="h-10 w-full bg-on-background border-[3px] border-outline relative overflow-hidden">
                <div
                  className="h-full bg-secondary flex items-center justify-end px-4 transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                >
                  <span className="material-symbols-outlined text-on-secondary animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-bold font-headline uppercase opacity-70">
                {STATUS_STEPS.map((s, i) => (
                  <span key={s} className={i <= stepIdx ? 'text-primary' : ''}>{STATUS_LABELS[s]}</span>
                ))}
              </div>
            </div>
          </section>

          {/* Order details */}
          {order && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-variant border-[3px] border-outline p-4 brutal-shadow -rotate-1">
                <h3 className="font-headline font-black border-b-2 border-outline mb-3 pb-1 uppercase">Your Order</h3>
                <ul className="space-y-2 font-body text-sm font-semibold">
                  {order.order_items?.map((oi, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{oi.custom_build ? `Custom Wrap ×${oi.quantity}` : `Item ×${oi.quantity}`}</span>
                      <span className="text-primary">${(oi.unit_price * oi.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between border-t-2 border-outline pt-2 font-black">
                    <span>Total</span>
                    <span>${(passedTotal ?? order.total ?? 0).toFixed(2)}</span>
                  </li>
                </ul>
              </div>
              <div className="bg-secondary border-[3px] border-outline p-4 brutal-shadow rotate-1">
                <h3 className="font-headline font-black border-b-2 border-outline mb-3 pb-1 uppercase text-on-secondary">Pickup</h3>
                <div className="space-y-2 text-on-secondary">
                  <p className="font-bold text-sm">Downtown Cantina — Counter 1</p>
                  <p className="text-xs">Show this screen when collecting</p>
                  <button onClick={() => navigate('/')} className="mt-2 w-full bg-on-background text-white font-headline font-bold text-xs py-2 border-2 border-outline brutal-shadow">
                    ORDER MORE
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <BottomNav active="ORDERS" />
    </div>
  )
}

export default OrderStatusPage
