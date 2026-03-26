import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const BottomNav = ({ active = 'MENU' }) => {
  const navigate = useNavigate()
  const { count } = useCart()

  const navItems = [
    { id: 'MENU',    icon: 'restaurant_menu', label: 'MENU',    path: '/' },
    { id: 'BUILD',   icon: 'layers',          label: 'BUILD',   path: '/build-base' },
    { id: 'CART',    icon: 'shopping_cart',   label: 'CART',    path: '/cart' },
    { id: 'PROFILE', icon: 'person',          label: 'PROFILE', path: '/profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-2 bg-[#FFD166] border-t-[3px] border-[#211A16] shadow-[0_-4px_0_0_#211A16]">
      {navItems.map((item) => {
        const isActive = active === item.id
        const showBadge = item.id === 'CART' && count > 0

        return (
          <div
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`relative flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 ${
              isActive
                ? 'bg-[#00E5FF] text-[#211A16] border-[2px] border-[#211A16] rotate-[-2deg] px-4 py-1 shadow-[2px_2px_0px_#211A16]'
                : 'text-[#211A16] dark:text-[#FFFDF7] opacity-80 hover:bg-[#ef5b06] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-headline font-bold text-[10px] uppercase">{item.label}</span>

            {/* Cart count badge */}
            {showBadge && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black font-headline min-w-[18px] h-[18px] px-0.5 flex items-center justify-center border-[2px] border-[#211A16] rotate-[8deg]">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default BottomNav
