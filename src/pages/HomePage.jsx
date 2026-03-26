import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import BottomNav from '../components/BottomNav'
import { useCart } from '../context/CartContext'

const QUICK_BITES = [
  { name: 'Tikka Taco',   price: 5.50, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD96K-LW9ZggpCqOkXqCWW8zmLYIn8kpQ0EDr2r18ZPK4wYMY01sba8g4DCBSOvFh_4JbAUFBynmDfxZO945QiNe1UvQSjpF8lSXaJ5jcs-ZW3rr7xooZY7xZna5nB0QK5PYBZQ4qXVRWqVafGRfWeIgWR589X0MucXiEgx7Gb9z1Tmj4-8WlvbJzmqXjDqjzTby3NBpSR8SBoJwwZdHdh4BVNZEMedn9tZO7n8T8P-NItH-i0yv4aYxWTcAWUGCldOT0qPCKjxt5Y' },
  { name: 'Paneer Wrap',  price: 8.25, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA-FLLU7m5zpzrijtQPalmb1Q1WHEDnhrEZu8Fv5pfZX17dxMGYU3wtTljEyjn7u-la__IkiEw5Zfw6PGUvgJw4v3No9E2WBuDmO61Sd-JPXz9Xue6XwgOogE71A6tErqHppESyCkEjwma8qV6hMsggS-vDJwJ3Mvh5ezeXNnekTv_uFBeK9ep9jwXKc2_Cgs-i94eNNTjX78TAWVgDEaPx7eMVQlUTNSBpoWDKcmp5dgIlACfSbCpP3GT_XQd4eXc1GrAPodIUv4' },
  { name: 'Masala Fries', price: 4.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqf9mytdOJtqf3E-PfPOW7IncJ_yJsjKbeaClrJc0rJ9B-kJyrZzqhqAiGzGcyW9sFt51u3qjeFUNQzd1xkRbxPoWxnvobwnzKHUqCB-akjZ1O83ZhW_X2dAKsb7t5zAJCBvXe1-xks_KOE9VQRmjhsC208aSA8hbWBKLnU3hML-71b2ZNPuZva3rXaw-x8mqlqYza1fRjUYsEIAOPCvV5bl5sGqDVTeW27CKQJ_ylro83fJ1EjtYqDAXxWxwKkPfVCb5r58lruyI' },
  { name: 'Mango Lassi',  price: 3.50, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZPx7x66yPkqSbnCb5F-1D7PlFrGxYJ9fO2Pwd8ng_AwMX6pdaiBrFeqNhUAgLYa4pDv6TelrQPkRpy7vg-QHRTbfPUqnL_DP59K7Ju-4Anw9ySuURPBj1yR8Ii7jdTZFW3cWoHzo3UVk6tbs4l3Mz5qlrz2ujVJCjy1YhQdQdtRiOMJfpnmLFHCYYKMoQe2NjIbmo-i7UuKiYFjS2PGdIvbW-y12qY3Rp43g0aqZx3IvN7TO0fMjoJVFmwWtSK0h73AfN-YeRBxI' },
]

const HomePage = () => {
  const navigate = useNavigate()
  const { items, dispatch } = useCart()

  // Stable id for quick-bite items
  const qbId = (item) => `qb-${item.name}`

  // How many of this item are in the cart already
  const cartQty = (item) => items.find(i => i.id === qbId(item))?.quantity ?? 0

  const addOne = (item) => dispatch({
    type: 'ADD_ITEM',
    payload: { id: qbId(item), name: item.name, price: item.price },
  })

  const removeOne = (item) => dispatch({
    type: 'UPDATE_QTY',
    payload: { id: qbId(item), qty: cartQty(item) - 1 },
  })

  return (
    <div className="min-h-screen pb-32 bg-background font-body text-on-background bg-dot-pattern">
      <TopAppBar />
      <main className="pt-24 px-4 max-w-5xl mx-auto">
        {/* Hero banner */}
        <section className="mb-8">
          <div
            className="relative bg-primary border-[3px] border-outline brutal-shadow p-6 overflow-hidden group cursor-pointer"
            onClick={() => navigate('/build-base')}
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-20 rounded-full"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <span className="inline-block bg-secondary text-on-secondary px-3 py-1 font-label font-bold text-xs uppercase mb-3 border-2 border-outline rotated-label brutal-shadow-sm">
                  Custom Creation
                </span>
                <h2 className="font-headline font-bold text-4xl text-white uppercase leading-none mb-4 tracking-tighter">
                  BUILD YOUR <br/>OWN TACO
                </h2>
                <p className="text-white/90 font-body mb-6 max-w-xs">
                  Choose your protein, salsa, and crunch. No rules, just flavor.
                </p>
                <button className="bg-surface-bright text-on-surface font-headline font-bold uppercase py-3 px-8 border-[3px] border-outline brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[4px] active:translate-y-[4px]">
                  START BUILDING
                </button>
              </div>
              <div className="w-full md:w-1/2 flex justify-center">
                <img alt="Gourmet Taco" className="w-48 h-48 md:w-64 md:h-64 object-cover border-[3px] border-outline rounded-full brutal-shadow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGJvDV-Xvj_Tfeww5T-zKcZnvQ2dpEmusGO5l3lBzl7jbFs9Q3776khIlKnrX8RyROrSwDXU7frzhTLM2qU_YrLefpbj3JXSZJ85m3I14hzKPwUP0HFdqIbGxx0VU7dysDFQEbidfJXdV5gUY2qJ1Gr4PgR2s5AlYJf3F902N53Ssk7dgdtahV8wYlErympal4CA0xLT7Ey65WnZwRpSd0iwx6yndBakkZmJYXUram-LoNpSax9foQjrgNjY2Eyj6MTxWJktINA64"/>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Bites */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline font-bold text-2xl uppercase tracking-tight text-on-background">Quick Bites</h3>
          <div className="h-[3px] flex-grow mx-4 bg-outline hidden sm:block"></div>
          <span className="font-label text-xs font-bold uppercase text-primary">View All</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {QUICK_BITES.map((item) => {
            const qty = cartQty(item)
            return (
              <div key={item.name} className="bg-surface-bright border-[3px] border-outline brutal-shadow flex flex-col">
                <div className="h-32 md:h-40 border-b-[3px] border-outline overflow-hidden">
                  <img alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src={item.img}/>
                </div>
                <div className="p-3 md:p-4 flex flex-col flex-grow">
                  <h4 className="font-headline font-bold text-base uppercase leading-tight mb-1">{item.name}</h4>
                  <span className="font-body text-sm font-bold text-primary mb-3">${item.price.toFixed(2)}</span>
                  <div className="mt-auto flex justify-end">
                    {qty === 0 ? (
                      /* Plain + button — item not in cart yet */
                      <button
                        onClick={() => addOne(item)}
                        className="bg-secondary p-2 border-2 border-outline brutal-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:translate-x-[2px] active:translate-y-[2px]"
                      >
                        <span className="material-symbols-outlined text-on-secondary font-bold">add</span>
                      </button>
                    ) : (
                      /* Inline counter — shows current qty with − and + */
                      <div className="flex items-center border-[2px] border-outline bg-secondary brutal-shadow-sm">
                        <button
                          onClick={() => removeOne(item)}
                          className="px-2 py-1 border-r-[2px] border-outline hover:bg-secondary/70 transition-colors"
                        >
                          <span className="material-symbols-outlined text-on-secondary text-sm font-bold">remove</span>
                        </button>
                        <span className="px-3 font-headline font-black text-sm text-on-secondary min-w-[1.5rem] text-center">{qty}</span>
                        <button
                          onClick={() => addOne(item)}
                          className="px-2 py-1 border-l-[2px] border-outline hover:bg-secondary/70 transition-colors"
                        >
                          <span className="material-symbols-outlined text-on-secondary text-sm font-bold">add</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <section className="mt-12 text-center">
          <div className="inline-block border-[3px] border-outline bg-surface-bright p-4 brutal-shadow rotated-label">
            <p className="font-headline font-bold text-xl uppercase tracking-tighter">
              Tacos with a <span className="text-primary">Desi Soul</span>
            </p>
          </div>
        </section>
      </main>
      <BottomNav active="MENU" />
    </div>
  )
}

export default HomePage
