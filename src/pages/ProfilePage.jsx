import TopAppBar from '../components/TopAppBar'
import BottomNav from '../components/BottomNav'

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-background font-body text-on-background bg-dot-pattern">
      <TopAppBar showBack={true} backTo="/" />
      <main className="pt-24 pb-28 px-4 max-w-2xl mx-auto">
        <div className="mb-8 inline-block bg-primary px-6 py-2 border-[3px] border-outline brutal-shadow rotate-[-1deg]">
          <h2 className="font-headline font-bold text-3xl uppercase text-white tracking-tighter">PROFILE</h2>
        </div>
        <div className="bg-surface-bright border-[3px] border-outline brutal-shadow p-6 flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full border-[3px] border-outline bg-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-on-secondary">person</span>
          </div>
          <div className="text-center">
            <h3 className="font-headline font-bold text-2xl uppercase">MAMASITA LOVER</h3>
            <p className="text-sm text-on-surface-variant font-medium">lover@mamasita.com</p>
          </div>
          <div className="w-full mt-4 space-y-3">
            {['Past Orders', 'Saved Addresses', 'Payment Methods', 'Notifications', 'Help & Support'].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 bg-surface-container-low border-[3px] border-outline brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer">
                <span className="font-headline font-bold uppercase text-sm">{item}</span>
                <span className="material-symbols-outlined">chevron_right</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <BottomNav active="PROFILE" />
    </div>
  )
}

export default ProfilePage
