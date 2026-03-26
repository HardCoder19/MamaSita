import { useState, useEffect, useCallback } from 'react'
import AdminLayout from './AdminLayout'
import { getAdminOrders, updateOrderStatus } from '../../lib/api'

function shortId(id) {
  return id?.slice(0, 6).toUpperCase() ?? '------'
}

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  return `${Math.floor(diff / 3600)}h`
}

function itemLabel(oi) {
  if (oi.custom_build) {
    const b = oi.custom_build
    return `Custom (${b.base || '?'} / ${b.protein || '?'} / ${b.sauce || '?'})`
  }
  return oi.menu_items?.name ?? 'Item'
}

export default function CookPage() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const { orders: allOrders, error } = await getAdminOrders()
    if (!error && allOrders) {
      setOrders(allOrders.filter(o => o.status === 'confirmed' || o.status === 'cooking'))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, 8_000)
    return () => clearInterval(interval)
  }, [load])

  const moveToStatus = async (id, status) => {
    await updateOrderStatus(id, status)
    load()
  }

  const queue   = orders.filter(o => o.status === 'confirmed')
  const cooking = orders.filter(o => o.status === 'cooking')

  return (
    <AdminLayout mode="cook">
      <div className="p-4">
        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">

          {/* IN QUEUE column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <h2 className="text-blue-300 font-black text-lg uppercase tracking-widest font-mono">
                IN QUEUE ({queue.length})
              </h2>
            </div>
            <div className="space-y-3">
              {loading ? (
                <p className="text-slate-500 font-mono text-sm">Loading…</p>
              ) : queue.length === 0 ? (
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center text-slate-600 font-mono text-sm">
                  No orders in queue
                </div>
              ) : (
                queue.map(order => (
                  <Ticket key={order.id} order={order} onAction={() => moveToStatus(order.id, 'cooking')} actionLabel="▶ START COOKING" actionColor="bg-orange-600 hover:bg-orange-500" />
                ))
              )}
            </div>
          </div>

          {/* COOKING column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
              <h2 className="text-orange-300 font-black text-lg uppercase tracking-widest font-mono">
                COOKING ({cooking.length})
              </h2>
            </div>
            <div className="space-y-3">
              {loading ? null : cooking.length === 0 ? (
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center text-slate-600 font-mono text-sm">
                  Nothing cooking
                </div>
              ) : (
                cooking.map(order => (
                  <Ticket key={order.id} order={order} onAction={() => moveToStatus(order.id, 'ready')} actionLabel="✓ MARK READY" actionColor="bg-green-600 hover:bg-green-500" />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Empty state */}
        {!loading && orders.length === 0 && (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">🌮</p>
            <p className="text-slate-400 font-mono text-lg uppercase tracking-widest">All clear! No orders yet.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

function Ticket({ order, onAction, actionLabel, actionColor }) {
  const elapsed = timeAgo(order.created_at)
  const isOld   = (Date.now() - new Date(order.created_at)) / 60000 > 15 // > 15 min

  return (
    <div className={`rounded-xl border-2 overflow-hidden ${
      order.status === 'cooking' ? 'border-orange-500/50 bg-orange-950/20' : 'border-blue-500/30 bg-blue-950/20'
    }`}>
      {/* Ticket header */}
      <div className={`px-5 py-3 flex items-center justify-between ${
        order.status === 'cooking' ? 'bg-orange-900/30' : 'bg-blue-900/20'
      }`}>
        <div className="flex items-center gap-3">
          <span className="font-black text-2xl font-mono text-white">#{shortId(order.id)}</span>
          <span className="text-slate-400 text-sm">{order.customers?.name ?? 'Walk-in'}</span>
        </div>
        <span className={`font-mono text-sm font-bold px-2 py-1 rounded ${isOld ? 'text-red-400 bg-red-900/30' : 'text-slate-400'}`}>
          {elapsed}
        </span>
      </div>

      {/* Items — big and readable */}
      <div className="px-5 py-4 space-y-2">
        {(order.order_items ?? []).map(oi => (
          <div key={oi.id} className="flex items-baseline gap-3">
            <span className="text-orange-400 font-black text-2xl font-mono leading-none">×{oi.quantity}</span>
            <span className="text-white text-lg font-bold leading-tight">{itemLabel(oi)}</span>
          </div>
        ))}
      </div>

      {/* Action */}
      <div className="px-5 pb-4">
        <button
          onClick={onAction}
          className={`w-full py-3 rounded-lg font-black uppercase tracking-widest text-white transition-colors text-sm ${actionColor}`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  )
}
