import { createContext, useContext, useReducer, useEffect } from 'react'

// ─── Helpers ────────────────────────────────────────────────────────────────
const TAX_RATE = 0.08
const STORAGE_KEY = 'mamasita_cart'

function calcTotals(items) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const tax      = parseFloat((subtotal * TAX_RATE).toFixed(2))
  const total    = parseFloat((subtotal + tax).toFixed(2))
  const count    = items.reduce((s, i) => s + i.quantity, 0)
  return { subtotal, tax, total, count }
}

// ─── Reducer ────────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {

    case 'ADD_ITEM': {
      // If same item exists (by id), increment quantity
      const existing = state.find(i => i.id === action.payload.id)
      if (existing) {
        return state.map(i =>
          i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...state, { ...action.payload, quantity: 1 }]
    }

    case 'REMOVE_ITEM':
      return state.filter(i => i.id !== action.payload.id)

    case 'UPDATE_QTY': {
      const { id, qty } = action.payload
      if (qty <= 0) return state.filter(i => i.id !== id)
      return state.map(i => i.id === id ? { ...i, quantity: qty } : i)
    }

    case 'CLEAR_CART':
      return []

    default:
      return state
  }
}

// ─── Context ────────────────────────────────────────────────────────────────
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(
    cartReducer,
    [],
    // Hydrate from localStorage on first load
    () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
      } catch {
        return []
      }
    }
  )

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const { subtotal, tax, total, count } = calcTotals(items)

  return (
    <CartContext.Provider value={{ items, dispatch, subtotal, tax, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

// ─── Hook ───────────────────────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
