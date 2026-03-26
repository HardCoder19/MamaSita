import { useState, useEffect, useCallback } from 'react'
import AdminLayout from './AdminLayout'
import {
  getAdminOrders, authorizeOrder, updateOrderStatus,
  deleteOrder, createManualOrder,
} from '../../lib/api'

const MENU_ITEMS = [
  { name: 'Tikka Taco',   price: 5.50 },
  { name: 'Paneer Wrap',  price: 8.25 },
  { name: 'Masala Fries', price: 4.00 },
  { name: 'Mango Lassi',  price: 3.50 },
  { name: 'Custom Build', price: 9.00 },
]

const TAX_RATE = 0.08

const STATUS_COLORS = {
  pending:   'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  confirmed: 'bg-blue-500/20   text-blue-300   border-blue-500/40',
  cooking:   'bg-orange-500/20 text-orange-300  border-orange-500/40',
  ready:     'bg-green-500/20  text-green-300   border-green-500/40',
  delivered: 'bg-slate-500/20  text-slate-400   border-slate-500/40',
}
const STATUS_LABELS = {
  pending: 'PENDING', confirmed: 'CONFIRMED', cooking: 'COOKING', ready: 'READY', delivered: 'DELIVERED',
}

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

function shortId(id) {
  return id?.slice(0, 6).toUpperCase() ?? '------'
}

function itemLabel(oi) {
  if (oi.custom_build) {
    const b = oi.custom_build
    return `Custom (${b.base || '?'} / ${b.protein || '?'} / ${b.sauce || '?'})`
  }
  return oi.menu_items?.name ?? 'Item'
}

// ─── Order Form Modal (New + Edit shared) ────────────────────────────────────
function OrderFormModal({ order, onClose, onSaved }) {
  const isEdit = !!order
  const [name,    setName]    = useState(order?.customers?.name ?? '')
  const [email,   setEmail]   = useState(order?.customers?.email ?? '')
  const [payment, setPayment] = useState(order?.payment_method ?? 'cash')
  const [qty,     setQty]     = useState(() => {
    const init = {}
    MENU_ITEMS.forEach(m => { init[m.name] = 0 })
    if (order?.order_items) {
      order.order_items.forEach(oi => {
        const label = oi.menu_items?.name ?? 'Custom Build'
        if (init[label] !== undefined) init[label] = oi.quantity
      })
    }
    return init
  })
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState(null)

  const cartItems = MENU_ITEMS
    .filter(m => qty[m.name] > 0)
    .map(m => ({ name: m.name, price: m.price, quantity: qty[m.name] }))

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const tax      = subtotal * TAX_RATE
  const total    = subtotal + tax

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Customer name is required'); return }
    if (cartItems.length === 0) { setError('Add at least one item'); return }
    setSaving(true); setError(null)

    if (isEdit) {
      // For edits: update status/payment, re-create order_items via RPC is out of scope here
      // so we just update the order header fields
      const newStatus = payment === 'card' ? 'confirmed' : (order.status === 'pending' ? 'pending' : order.status)
      const { error } = await updateOrderStatus(order.id, newStatus)
      setSaving(false)
      if (error) { setError(error.message); return }
    } else {
      const { error } = await createManualOrder({ name, email }, cartItems, payment)
      setSaving(false)
      if (error) { setError(error.message); return }
    }
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h3 className="font-bold text-white text-lg uppercase tracking-wide">
            {isEdit ? 'Edit Order' : 'New Order'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Customer */}
          <div className="space-y-3">
            <label className="text-xs text-slate-400 uppercase tracking-widest font-mono">Customer Name *</label>
            <input
              value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2.5 rounded focus:outline-none focus:border-orange-500 font-mono text-sm"
              placeholder="Customer name"
            />
            <input
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2.5 rounded focus:outline-none focus:border-orange-500 font-mono text-sm"
              placeholder="Email (optional)"
            />
          </div>

          {/* Items */}
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-widest font-mono mb-3 block">Items</label>
            <div className="space-y-2">
              {MENU_ITEMS.map(m => (
                <div key={m.name} className="flex items-center justify-between bg-slate-700/50 rounded px-3 py-2">
                  <div>
                    <p className="text-white text-sm font-medium">{m.name}</p>
                    <p className="text-slate-400 text-xs">${m.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-600 rounded-full overflow-hidden">
                    <button
                      onClick={() => setQty(q => ({ ...q, [m.name]: Math.max(0, q[m.name] - 1) }))}
                      className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-500 transition-colors"
                    >−</button>
                    <span className="w-6 text-center text-white text-sm font-bold">{qty[m.name]}</span>
                    <button
                      onClick={() => setQty(q => ({ ...q, [m.name]: q[m.name] + 1 }))}
                      className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-500 transition-colors"
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment method */}
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-widest font-mono mb-3 block">Payment</label>
            <div className="flex gap-2">
              {['cash', 'card'].map(p => (
                <button
                  key={p}
                  onClick={() => setPayment(p)}
                  className={`flex-1 py-2.5 rounded font-bold uppercase text-sm tracking-wide transition-colors ${
                    payment === p ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            {payment === 'cash' && (
              <p className="text-xs text-yellow-400 mt-2 font-mono">
                ⚠ Cash orders start as PENDING — authorize when customer pays.
              </p>
            )}
          </div>

          {/* Totals */}
          <div className="bg-slate-700/50 rounded px-4 py-3 text-sm font-mono space-y-1">
            <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-slate-400"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-white font-bold border-t border-slate-600 pt-1 mt-1">
              <span>TOTAL</span><span>${total.toFixed(2)}</span>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm font-mono bg-red-900/30 border border-red-700 p-3 rounded">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded uppercase tracking-widest text-sm transition-colors"
          >
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Order'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Counter Page ────────────────────────────────────────────────────────
const FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'COOKING', 'READY']

export default function CounterPage() {
  const [orders,      setOrders]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [filter,      setFilter]      = useState('ALL')
  const [modalOrder,  setModalOrder]  = useState(undefined) // undefined=closed, null=new, order=edit
  const [confirmDel,  setConfirmDel]  = useState(null)      // order id to delete

  const load = useCallback(async () => {
    const { orders, error } = await getAdminOrders()
    if (!error) setOrders(orders ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, 15_000)
    return () => clearInterval(interval)
  }, [load])

  const filteredOrders = filter === 'ALL'
    ? orders
    : orders.filter(o => o.status.toUpperCase() === filter)

  const todayOrders  = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString())
  const todayRevenue = todayOrders.reduce((s, o) => s + (o.total || 0), 0)
  const pendingCount = orders.filter(o => o.status === 'pending').length

  const doAuthorize = async (id) => {
    await authorizeOrder(id)
    load()
  }

  const doStatusChange = async (id, status) => {
    await updateOrderStatus(id, status)
    load()
  }

  const doDelete = async (id) => {
    await deleteOrder(id)
    setConfirmDel(null)
    load()
  }

  return (
    <AdminLayout mode="counter">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-slate-800/50 border-b border-slate-700">
        {[
          { label: "Today's Orders",  value: todayOrders.length },
          { label: 'Awaiting Auth',   value: pendingCount, warn: pendingCount > 0 },
          { label: "Today's Revenue", value: `$${todayRevenue.toFixed(2)}` },
        ].map(s => (
          <div key={s.label} className="text-center">
            <p className={`text-2xl font-black ${s.warn ? 'text-yellow-400' : 'text-white'}`}>{s.value}</p>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-mono mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 p-4 overflow-x-auto border-b border-slate-700">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
              filter === f ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {f}
          </button>
        ))}
        <button
          onClick={load}
          className="ml-auto px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-slate-700 text-slate-300 hover:bg-slate-600 whitespace-nowrap"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Orders */}
      <div className="p-4 space-y-4 max-w-3xl mx-auto pb-24">
        {loading ? (
          <div className="text-center py-16 text-slate-400 font-mono">Loading orders…</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-slate-500 font-mono">
            {filter === 'ALL' ? 'No active orders.' : `No ${filter.toLowerCase()} orders.`}
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              {/* Card header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700">
                <div>
                  <p className="text-white font-black text-lg font-mono">#{shortId(order.id)}</p>
                  <p className="text-slate-400 text-sm">{order.customers?.name ?? 'Walk-in'}</p>
                </div>
                <div className="ml-auto flex flex-wrap gap-2 justify-end">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${STATUS_COLORS[order.status] ?? STATUS_COLORS.pending}`}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${
                    order.payment_method === 'card'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                  }`}>
                    {order.payment_method ?? 'cash'}
                  </span>
                  <span className="text-slate-500 text-xs font-mono">{timeAgo(order.created_at)}</span>
                </div>
              </div>

              {/* Items */}
              <div className="px-5 py-3 space-y-1">
                {(order.order_items ?? []).map(oi => (
                  <div key={oi.id} className="flex justify-between text-sm">
                    <span className="text-slate-300">× {oi.quantity} {itemLabel(oi)}</span>
                    <span className="text-slate-400 font-mono">${(oi.unit_price * oi.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-4 bg-slate-700/30 border-t border-slate-700/50">
                <p className="text-white font-bold font-mono">Total: ${(order.total ?? 0).toFixed(2)}</p>
                <div className="flex gap-2 flex-wrap justify-end">
                  {/* Authorize */}
                  {order.status === 'pending' && (
                    <button
                      onClick={() => doAuthorize(order.id)}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold uppercase rounded tracking-wider transition-colors"
                    >
                      ✓ Authorize
                    </button>
                  )}
                  {/* Status nudges */}
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => doStatusChange(order.id, 'cooking')}
                      className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase rounded tracking-wider transition-colors"
                    >
                      → Cooking
                    </button>
                  )}
                  {order.status === 'cooking' && (
                    <button
                      onClick={() => doStatusChange(order.id, 'ready')}
                      className="px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white text-xs font-bold uppercase rounded tracking-wider transition-colors"
                    >
                      ✓ Ready
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => doStatusChange(order.id, 'delivered')}
                      className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white text-xs font-bold uppercase rounded tracking-wider transition-colors"
                    >
                      Delivered
                    </button>
                  )}
                  {/* Edit */}
                  <button
                    onClick={() => setModalOrder(order)}
                    className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white text-xs font-bold uppercase rounded tracking-wider transition-colors"
                  >
                    Edit
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => setConfirmDel(order.id)}
                    className="px-3 py-1.5 bg-red-900/50 hover:bg-red-800 text-red-300 text-xs font-bold uppercase rounded tracking-wider transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating NEW ORDER button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setModalOrder(null)}
          className="bg-orange-500 hover:bg-orange-600 text-white w-14 h-14 rounded-full shadow-2xl text-3xl font-bold flex items-center justify-center transition-colors"
        >
          +
        </button>
      </div>

      {/* Order Form Modal */}
      {modalOrder !== undefined && (
        <OrderFormModal
          order={modalOrder}
          onClose={() => setModalOrder(undefined)}
          onSaved={load}
        />
      )}

      {/* Delete Confirm */}
      {confirmDel && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <p className="text-white font-bold text-lg mb-2">Delete order #{shortId(confirmDel)}?</p>
            <p className="text-slate-400 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => doDelete(confirmDel)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded font-bold uppercase text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDel(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded font-bold uppercase text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
