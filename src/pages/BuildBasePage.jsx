import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import BottomNav from '../components/BottomNav'
import BuildProgress from '../components/BuildProgress'
import BuildPageHeader from '../components/BuildPageHeader'
import BuildOptionCard from '../components/BuildOptionCard'
import BuildNextButton from '../components/BuildNextButton'

const bases = [
  {
    name: 'Classic Wheat',
    desc: 'Traditional artisan wheat dough, hand-stretched and fired for a nutty, complex flavor.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDLLdxiPuEQXZWWdRaM3OL4dSwFRaqUGjiOK2Nn19eyNUdCFduxnVmEBTWMv9W6xszzMSJHWdaHjEGV7qcQG4pCEDDEsmiZ4RmbzqUR7sLXGGGzDi7qWYPFQ1W7bFEZIqXhHpleaZjgD83m_ZwZ1EFbHHKKb7Jifai3IXh17Bg8nxo3OgJoCQjM7FQGoqbJ8OIZv-kww39rF5pFTA_4V-00GoEo1-_kgj8Rpaghx9sHpDv8VUBGLzUEPFPDyZWfxG2nVVU8c3Z3ZY',
    badge: <div className="absolute -top-2 -right-2 bg-outline text-surface px-2 py-0.5 text-[10px] font-bold uppercase rotate-[3deg] neo-brutal-shadow-sm z-10">POPULAR</div>,
  },
  {
    name: 'White Flour',
    desc: 'Ultra-soft, buttery, and flexible. The perfect canvas for bold, spicy fillings.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEdfpia2mVCvefvgcocYQ9oNdHd0tDrrzJtT10WWRdmiyoen-I9qohEQq7bXVi8vBxWPX9xvWR7tTswELQdRC0LWg_PzLCVZpcKfS3nkdWgamWMSbI6T5oSQa04wlINdOOlkST9cJ6pcO17_Ejp28-qvNs40sY2FGO7-v5CNuZqrJZi9G_JfdxqSdjLJtIM58AiJETSFdPDVOFUZ3Oc3yJkh3zRAk4gorA_P2fpmc1Y0T21aZ5UKyx1R7xBfKQfBNkrnyocAu3S2M',
  },
]

const TILTS = ['-rotate-1', 'rotate-1']

const BuildBasePage = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(0)

  return (
    <div className="min-h-screen pb-40 bg-background font-body text-on-background bg-dot-pattern">
      <TopAppBar />
      <main className="pt-24 px-6 max-w-2xl mx-auto">
        <BuildProgress currentStep={1} />
        <BuildPageHeader verb="PICK YOUR" keyword="BASE" />

        <div className="space-y-5">
          {bases.map((base, idx) => (
            <BuildOptionCard
              key={idx}
              img={base.img}
              alt={base.name}
              name={base.name}
              desc={base.desc}
              selected={selected === idx}
              tilt={TILTS[idx % 2]}
              badge={base.badge}
              onClick={() => setSelected(idx)}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <div className="bg-outline text-surface-bright p-4 border-[3px] border-primary rotate-[-1deg] neo-shadow">
            <p className="font-headline font-bold text-xs uppercase tracking-widest text-center">
              Pro Tip: Street Corn pairs best <br /> with Slow-Cooked Birria!
            </p>
          </div>
        </div>
      </main>

      <BuildNextButton
        label="NEXT: PROTEIN"
        onClick={() => {
          const { badge, ...safeBase } = bases[selected]
          navigate('/build-protein', { state: { base: safeBase } })
        }}
      />
      <BottomNav active="BUILD" />
    </div>
  )
}

export default BuildBasePage
