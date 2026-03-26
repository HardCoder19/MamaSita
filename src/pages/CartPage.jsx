import { useNavigate } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import BottomNav from '../components/BottomNav'
import { useCart } from '../context/CartContext'

const CartPage = () => {
  const navigate = useNavigate()
  const { items, dispatch, subtotal, tax, total } = useCart()

  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } })
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } })

  return (
    <div className="min-h-screen pb-40 bg-background font-body text-on-background bg-dot-pattern">
      <TopAppBar />
      <main className="pt-24 px-4 max-w-2xl mx-auto">
        <div className="mb-8 rotate-[-1deg] inline-block bg-primary px-6 py-2 border-[3px] border-outline brutal-shadow">
          <h2 className="font-headline font-bold text-3xl uppercase text-white tracking-tighter">YOUR CART</h2>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-7xl opacity-20 mb-4 block">shopping_bag</span>
            <p className="font-headline font-bold text-xl uppercase text-on-surface-variant">Your cart is empty</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 bg-primary text-white font-headline font-bold px-8 py-3 border-[3px] border-outline brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-surface-bright border-[3px] border-outline brutal-shadow overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <h3 className="font-headline font-bold text-lg uppercase leading-tight">{item.name}</h3>
                        {item.description && (
                          <p className="text-xs text-on-surface-variant font-medium mt-0.5">{item.description}</p>
                        )}
                      </div>
                      <span className="font-headline font-bold text-lg ml-4">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={() => navigate('/build-base')}
                        className="text-xs font-bold uppercase underline decoration-primary decoration-2 underline-offset-4 hover:text-primary transition-colors"
                      >
                        {item.customBuild ? 'EDIT' : null}
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-bold uppercase underline decoration-error decoration-2 underline-offset-4 hover:text-error transition-colors"
                      >
                        REMOVE
                      </button>
                      <div className="ml-auto flex items-center border-[2px] border-outline bg-white brutal-shadow-sm">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-2 py-1 hover:bg-surface border-r-[2px] border-outline">
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="px-3 font-bold text-sm min-w-[2rem] text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-2 py-1 hover:bg-surface border-l-[2px] border-outline">
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="mt-10 bg-surface-bright border-[3px] border-outline brutal-shadow p-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary rounded-full opacity-20 border-[3px] border-outline"></div>
              <h3 className="font-headline font-bold text-xl uppercase mb-6 relative z-10">ORDER SUMMARY</h3>
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-sm font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>Tax (8%)</span>
                  <span className="font-bold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>Delivery</span>
                  <span className="font-bold text-secondary-dim uppercase italic">Free</span>
                </div>
                <div className="border-t-[3px] border-outline pt-4 mt-4 flex justify-between items-center">
                  <span className="font-headline font-bold text-xl uppercase">TOTAL</span>
                  <span className="font-headline font-bold text-2xl">${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3 bg-secondary-container p-3 border-[2px] border-outline rotate-[1deg]">
                <span className="material-symbols-outlined">schedule</span>
                <p className="text-xs font-bold uppercase leading-tight">Arriving in approx. 25–35 minutes</p>
              </div>
            </div>
          </>
        )}
      </main>

      {items.length > 0 && (
        <div className="fixed bottom-20 left-0 w-full px-4 pb-4 z-40">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#211A16] text-white py-5 border-[3px] border-[#211A16] brutal-shadow flex items-center justify-center gap-3 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-2xl">credit_card</span>
              <span className="font-headline font-extrabold text-xl tracking-tighter">CHECKOUT · ${total.toFixed(2)}</span>
            </button>
          </div>
        </div>
      )}
      <BottomNav active="CART" />
    </div>
  )
}

export default CartPage
