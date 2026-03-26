import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminLayout = ({ children, mode }) => {
  const { signOut } = useAuth()
  const navigate    = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* Top bar */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center gap-4 sticky top-0 z-50 shadow-lg">
        {/* Logo */}
        <div className="bg-orange-500 px-3 py-1 rotate-[-1deg] shrink-0">
          <span className="font-black text-white text-lg tracking-tight uppercase" style={{ fontFamily: 'Impact, sans-serif' }}>
            MAMASITA
          </span>
        </div>

        <span className="text-slate-600 text-lg">|</span>
        <span className="text-slate-400 text-sm font-mono uppercase tracking-widest hidden sm:block">Admin</span>

        {/* Mode switcher */}
        <div className="ml-auto flex items-center bg-slate-700 rounded-full p-1 gap-1">
          <Link
            to="/admin/counter"
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              mode === 'counter'
                ? 'bg-orange-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Counter
          </Link>
          <Link
            to="/admin/cook"
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              mode === 'cook'
                ? 'bg-orange-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cook
          </Link>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="ml-2 text-slate-400 hover:text-red-400 transition-colors text-sm font-mono uppercase tracking-wider"
        >
          Sign&nbsp;out
        </button>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
