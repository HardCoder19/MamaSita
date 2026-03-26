import { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import BottomNav from '../components/BottomNav'
import { getOrder } from '../lib/api'

// DB status  →  display step index (0-based)
// pending    = 0 (Received — cash awaiting auth)
// confirmed  = 1 (Prepping — paid / authorized )
// cooking    = 2 (Cooking)
// ready      = 3 (Ready!)
// delivered  = 3 (stays at Ready for the customer view)
const STATUS_TO_STEP = {
  pending:   0,
  confirmed: 1,
  cooking:   2,
  ready:     3,
  delivered: 3,
}

const STEPS = [
  { key: 'received',  label: 'Received'  },
  { key: 'prepping',  label: 'Prepping'  },
  { key: 'cooking',   label: 'Cooking'   },
  { key: 'ready',     label: 'Ready! 🌮' },
]

const HEADLINES = {
  pending:   { title: "ORDER RECEIVED!",    sub: "Awaiting payment confirmation…"     },
  confirmed: { title: "WE'RE ON IT!",       sub: "Your order is being prepared"       },
  cooking:   { title: "WE'RE COOKING!",     sub: "Almost there — smells amazing 🌮"  },
  ready:     { title: "ORDER READY! 🎉",    sub: "Come collect at the counter"        },
  delivered: { title: "ENJOY YOUR MEAL!",   sub: "Thanks for eating with MAMASITA ❤️" },
}

const OrderStatusPage = () => {
  const location   = useLocation()
  const navigate   = useNavigate()
  const orderId    = location.state?.orderId
  const passedTotal = location.state?.total

  const [order,   setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchOrder = useCallback(async () => {
    if (!orderId) return
    const { order: o } = await getOrder(orderId)
    if (o) setOrder(o)
    setLoading(false)
  }, [orderId])

  // Initial load + live polling every 8 seconds
  useEffect(() => {
    fetchOrder()
    const interval = setInterval(fetchOrder, 8_000)
    return () => clearInterval(interval)
  }, [fetchOrder])

  const dbStatus   = order?.status ?? 'pending'
  const stepIdx    = STATUS_TO_STEP[dbStatus] ?? 0
  const progressPct = Math.round(((stepIdx + 1) / STEPS.length) * 100)
  const headline   = HEADLINES[dbStatus] ?? HEADLINES.confirmed
  const isReady    = dbStatus === 'ready' || dbStatus === 'delivered'

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
            {/* Order # badge */}
            <div className="absolute -top-4 -right-4 bg-primary text-white p-4 rotate-12 border-2 border-outline z-10">
              <span className="font-display text-sm">#{order?.id?.slice(0, 6).toUpperCase() ?? '------'}</span>
            </div>

            {/* Banner image */}
            <div className="relative z-0 mb-6 border-b-[3px] border-outline -mx-6 -mt-6 aspect-video">
              <img
                alt="Taco Food Truck"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfT1WFrzW5JIZZunKnQygMB3n3qVliFepY4Gp7wKOrqRXwTxVCoqgZ8MZj3qxaKqDDf0JNBbluKZCVCCRaTPqv7ZYvApLX0mhGRueZpySTkHpBIXbFOKN4w2ru1S1ZFp6YS1H9hRE71x1KhsA8IVgftvaZpBmLoyMPXdVsZmg35Kauoq55t_puLpnl4rPoHIm2SA93eyn3y9XEDx4rfOMeFGK7LkK2O2o6wsEYG5FaTbkSLei1LdbqihV9Qxkb8OZzASzhyDyLCak"
              />
            </div>

            {/* Headline */}
            <div className="text-center space-y-2">
              <h2 className={`font-display text-5xl md:text-6xl uppercase tracking-normal leading-tight transition-all duration-700 ${isReady ? 'text-green-600' : 'text-primary'}`}>
                {loading ? 'LOADING...' : headline.title}
              </h2>
              <p className="font-headline font-bold text-xl uppercase italic">
                {loading ? 'Fetching your order…' : headline.sub}
              </p>
              {/* Live indicator */}
              {!loading && (
                <p className="text-xs text-slate-400 font-mono flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block"></span>
                  Live
                </p>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-end">
                <span className="font-headline font-black text-xs uppercase tracking-widest px-2 py-1 bg-on-background text-white">Progress</span>
                <span className="font-display text-2xl text-secondary">{progressPct}%</span>
              </div>

              {/* Bar */}
              <div className="h-10 w-full bg-on-background border-[3px] border-outline relative overflow-hidden">
                <div
                  className={`h-full flex items-center justify-end px-4 transition-all duration-700 ${isReady ? 'bg-green-500' : 'bg-secondary'}`}
                  style={{ width: `${progressPct}%` }}
                >
                  <span
                    className="material-symbols-outlined text-on-secondary animate-pulse"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isReady ? 'check_circle' : 'restaurant'}
                  </span>
                </div>
              </div>

              {/* Step labels */}
              <div className="flex justify-between">
                {STEPS.map((step, i) => (
                  <div key={step.key} className="flex flex-col items-center gap-1">
                    {/* Dot */}
                    <div className={`w-3 h-3 rounded-full border-2 border-outline transition-all duration-500 ${
                      i <= stepIdx ? (isReady ? 'bg-green-500' : 'bg-secondary') : 'bg-surface-variant'
                    }`}></div>
                    <span className={`text-[10px] font-bold font-headline uppercase transition-colors duration-500 ${
                      i <= stepIdx ? (isReady ? 'text-green-600' : 'text-primary') : 'opacity-40'
                    }`}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cash pending notice */}
            {dbStatus === 'pending' && !loading && (
              <div className="mt-6 flex items-center gap-3 bg-amber-50 border-[3px] border-amber-400 p-4">
                <span className="material-symbols-outlined text-amber-600 text-2xl">payments</span>
                <div>
                  <p className="font-headline font-bold text-sm uppercase text-amber-800">Cash payment pending</p>
                  <p className="text-xs text-amber-700">Please pay at the counter — your order will start cooking once confirmed.</p>
                </div>
              </div>
            )}
          </section>

          {/* Order details */}
          {order && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-variant border-[3px] border-outline p-4 brutal-shadow -rotate-1">
                <h3 className="font-headline font-black border-b-2 border-outline mb-3 pb-1 uppercase">Your Order</h3>
                <ul className="space-y-2 font-body text-sm font-semibold">
                  {order.order_items?.map((oi, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{oi.custom_build ? `Custom Build ×${oi.quantity}` : `Item ×${oi.quantity}`}</span>
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
                  <p className="font-bold text-sm">MAMASITA Food Truck — Counter</p>
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
