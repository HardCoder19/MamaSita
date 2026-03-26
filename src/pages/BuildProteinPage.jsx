import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import BottomNav from '../components/BottomNav'
import BuildProgress from '../components/BuildProgress'
import BuildPageHeader from '../components/BuildPageHeader'
import BuildOptionCard from '../components/BuildOptionCard'
import BuildNextButton from '../components/BuildNextButton'

const proteins = [
  { name: 'Chicken', desc: 'Citrus-marinated flame-grilled breast', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3WWZYiXYIdP0e9fizyewA_8XeZzNcHvhT9IW-rYNK63cWppvg_WBf5i926eXpTJ5NTug4bXq5QLfMBrTCYMGRz4krvymiJhNzvalYcq871cSLLliouyuulXeXnEfz9SjYOi6gju6QUZ2hLhciAIYoyNJFhuP9F7vfews8iBUoK537oHNMCuBse-rtiDRMFQUhwmzK1SSupDF2kM4GM5XZnnAZYRzMUASR2pVtFrScjLP6fHRyRkcXGp1i4uJWIK7GYk49rfxZhCM' },
  { name: 'Pork',    desc: '12-hour slow braised carnitas',         img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGCuP_W5_EvJqg8sOSgEOTzUTeSPw2hQLqA4LVnSWeIOmorrwyDOSSB3I1TdtxHEG4aLDICzg8AQeQ3-QpSSLkmFhGa44_NdHbBdM5WT0tghBG1jwBuqnhdr_VZ33G9_R_-EUnw6M4df_QTlfLRS6cxpy7JwMISfo44CokLUGzG0rr37gF17pa6lmnofl5AEBd_0_mSSVEByfsXhFXugpbfRtFnmz85IqI6wDCPOg8la0e5D4wsW1-UhKI18IoD1fdpCj9RrlhB4I' },
  { name: 'Beef',    desc: 'Chili-rubbed premium steak strips',     img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBBukQoahusSMprgZDyflvTwuqIVHmLrzDmC3jwAT6pCcZZAMBcUW134fyVs_w_8fYJyJKhDdjaJmXQ076Ke2bldQNj-jKYyOMJHEGUNVH-7H8v2pLqyzySOiBgDYn3jx2NiD4QafaFVktgWJTY6I_bj9NYxNpwO9nxcnpGy57Hn5_Nafi-lvx8rVQCGa-RIKrUh7Wx1Pit1qYFRfNZe7X0k-l-aenz4ApOb7g-LJ3UOnWlfyfs5AcrTqT3dW_E4fm8N2RA0saaZE' },
  { name: 'Paneer',  desc: 'Spiced and seared artisan cheese',       img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnA8frDyyKdq4T9Cvb1V1gw-i9yV9a3zVOgRySDHr5bwPpzc7kQwRKZpDIF-HcTLfdDPfIyYDasHhDJEhhonyMaybzGtAPju1YqTVBXF0g16LMq4NljRPit2zC2nzYve6AdMUEyepLNswB995PbCDkvpQNLBbDY6W4Fu4useveqxgbpPd6SsWFTfIU8o2gXqeMr0r9cbxGbqOA36UUaKFIld5LpHHFhJWJ0WhqoFpViGxCRO3nVpR0pkoNPh5eh8VkAQSJHHebw18' },
]

const TILTS = ['-rotate-1', 'rotate-1', '-rotate-1', 'rotate-1']

const BuildProteinPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const base = location.state?.base  // passed from BuildBasePage
  const [selected, setSelected] = useState(0)

  return (
    <div className="min-h-screen pb-40 bg-background font-body text-on-background bg-dot-pattern">
      <TopAppBar showBack={true} backTo="/build-base" />
      <main className="pt-24 px-6 max-w-2xl mx-auto">
        <BuildProgress currentStep={2} />
        <BuildPageHeader verb="CHOOSE" keyword="PROTEIN" />

        <div className="space-y-5">
          {proteins.map((protein, idx) => (
            <BuildOptionCard
              key={idx}
              img={protein.img}
              alt={protein.name}
              name={protein.name}
              desc={protein.desc}
              selected={selected === idx}
              tilt={TILTS[idx % 2]}
              onClick={() => setSelected(idx)}
            />
          ))}
        </div>

        <div className="mt-8 p-4 bg-tertiary-container border-[3px] border-outline neo-brutal-shadow-sm flex items-start gap-4">
          <span className="material-symbols-outlined text-on-tertiary-container mt-1">info</span>
          <p className="text-sm font-semibold text-on-tertiary-container leading-tight">
            All our proteins are sourced from local farms and prepared fresh daily. No shortcuts.
          </p>
        </div>
      </main>

      <BuildNextButton
        label="NEXT: SAUCE"
        onClick={() => navigate('/build-sauce', { state: { base, protein: proteins[selected] } })}
      />
      <BottomNav active="BUILD" />
    </div>
  )
}

export default BuildProteinPage
