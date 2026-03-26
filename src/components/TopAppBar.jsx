import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const TopAppBar = ({ showBack = false, backTo = '/' }) => {
  const navigate = useNavigate()
  const { count } = useCart()

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#FFD166] dark:bg-[#211A16] border-b-[3px] border-[#211A16] shadow-[4px_4px_0px_#211A16]">
      <div className="flex items-center gap-4">
        {showBack ? (
          <button onClick={() => navigate(backTo)} className="hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
            <span className="material-symbols-outlined text-[#211A16] dark:text-[#FFFDF7] text-2xl">arrow_back</span>
          </button>
        ) : (
          <button className="hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
            <span className="material-symbols-outlined text-[#211A16] dark:text-[#FFFDF7] text-2xl">menu</span>
          </button>
        )}
        {showBack && <h1 className="font-headline uppercase tracking-tighter text-2xl font-black text-[#211A16] italic hidden sm:block">MAMASITA</h1>}
      </div>

      {!showBack && <h1 className="text-2xl font-brand uppercase text-[#211A16] dark:text-[#FFD166] tracking-widest">MAMASITA</h1>}
      {showBack && <div className="text-2xl font-brand uppercase text-[#211A16] dark:text-[#FFD166] tracking-widest sm:hidden">MAMASITA</div>}

      {/* Cart button with live badge */}
      <button
        onClick={() => navigate('/cart')}
        className="relative hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
      >
        <span className="material-symbols-outlined text-[#211A16] dark:text-[#FFFDF7] text-2xl">shopping_bag</span>
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-black font-headline w-5 h-5 flex items-center justify-center border-[2px] border-[#211A16] rotate-[6deg]">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>
    </header>
  )
}

export default TopAppBar
