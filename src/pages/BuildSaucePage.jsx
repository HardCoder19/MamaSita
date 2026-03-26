import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import TopAppBar from '../components/TopAppBar'
import BottomNav from '../components/BottomNav'
import BuildProgress from '../components/BuildProgress'
import BuildPageHeader from '../components/BuildPageHeader'
import BuildOptionCard from '../components/BuildOptionCard'
import BuildNextButton from '../components/BuildNextButton'
import { useCart } from '../context/CartContext'

const sauces = [
  { name: 'Tikka Masala',   desc: 'Creamy, tomato-based classic with a hint of smoky flavor.',              img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-wWQQzwHhte1nh4L56Qe1ap1SX6SURTpuUiqqO-RWb1LQZe9u3nOrGsFB8940tD3LNkuAc9Ww_Ul_V9XU7TY8ojRKMgfyNXh3Y58WpsdKFZNbIG1u_Z0gs3eLFLT6fpgc3EjWi02lkbsBegGl0K7TytSH4W5AQUlaTz_PudeGmIgo_HHA_3qielBakAYCDIzkLgefgw8LJgfduUAA9AsOXthj3UEqzb1cBZxUDnzehi9hnjDAUzduoWeVAY-xDBveRda4sA6ZIhc', spicy: false },
  { name: 'Chettinad Heat', desc: 'Bold, spicy, and packed with roasted peppercorns and curry leaves.',     img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWmlV3EE0jzjwJWnX9x7Xzm_-5IkQ8d99XXwQeUXn7kJS7oXh4-3fxwi5HYVTcxuYV-4a8tgkaRXWw94beYF6frZOf5k8vw5MYJsCZzHtcYftWZuniPzIyIhvwpIHFO19Q6D2t_VaG_tdLHQoID-sTw56fRFkv1-A42ZJzRN12IoYtUBGpATxPnHQ1X54-t6Xgx3E8m_F-lx8srmXC6RpU7DckgxX05xJ2oLNGQwPTW5FlxwcDUkmGBwOw8ffkDNS45AC2Jf92Qvo', spicy: true },
  { name: 'Butter Masala',  desc: 'Velvety smooth and mild. Rich butter with aromatic spices.',             img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDc_Td7OYdK_V1trTcJjPvQ0Jht2bxySH-3NuhK1JaxhSJIn6-xK1S4HV_PqpiU1SzfMAnq19T7JlasX3tw1zL0sl_rG5QffBVcyle_06Rwd_HnPOplhOpfR5EDl9yTW7gehY65RAXI5FQ24m3h3eU7_4TTheoKwoQz-vji8VeBXdn5kbuvjeDFs-zlF7-uQZ8WINAUU8lm3r_tJTvzFwqUZpC1NL-Fq2j2y3Ybd_a1JREKobdtl-gon8woRpbfjVZlxxnhzG4uv5o', spicy: false },
]

const TILTS = ['-rotate-1', 'rotate-1', '-rotate-1']

const BuildSaucePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const base    = location.state?.base
  const protein = location.state?.protein
  const { dispatch } = useCart()
  const [selected, setSelected] = useState(1)

  const handleAddToCart = () => {
    const sauce = sauces[selected]
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: uuidv4(),
        name: `Custom Wrap`,
        description: `${base?.name ?? 'Base'} · ${protein?.name ?? 'Protein'} · ${sauce.name}`,
        price: 9.00,
        customBuild: {
          base:    base?.name    ?? '',
          protein: protein?.name ?? '',
          sauce:   sauce.name,
        },
      },
    })
    navigate('/cart')
  }

  return (
    <div className="min-h-screen pb-40 bg-background font-body text-on-background bg-dot-pattern">
      <TopAppBar showBack={true} backTo="/build-protein" />
      <main className="pt-24 px-6 max-w-2xl mx-auto">
        <BuildProgress currentStep={3} />
        <BuildPageHeader verb="SAUCE" keyword="IT UP" />

        <div className="space-y-5">
          {sauces.map((sauce, idx) => (
            <BuildOptionCard
              key={idx}
              img={sauce.img}
              alt={sauce.name}
              name={sauce.name}
              desc={sauce.desc}
              selected={selected === idx}
              tilt={TILTS[idx]}
              badge={
                sauce.spicy
                  ? <div className="absolute -top-2 -right-2 bg-primary text-white px-2 py-0.5 text-[10px] font-bold border-[2px] border-outline rotate-[8deg] z-10">SPICY!</div>
                  : null
              }
              onClick={() => setSelected(idx)}
            />
          ))}
        </div>

        <div className="mt-12 p-6 border-[3px] border-outline bg-[#D9B455] relative overflow-hidden rotate-[-1deg]">
          <div className="relative z-10">
            <h3 className="font-headline font-bold uppercase text-lg mb-2">Pro Tip: Spice Levels</h3>
            <p className="text-sm font-body">Chettinad Heat is authentic South Indian style. Can't handle the flame? Go Tikka!</p>
          </div>
          <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl opacity-10 rotate-[-15deg]">local_fire_department</span>
        </div>
      </main>

      <BuildNextButton label="ADD TO CART" price="$9.00" onClick={handleAddToCart} />
      <BottomNav active="BUILD" />
    </div>
  )
}

export default BuildSaucePage
