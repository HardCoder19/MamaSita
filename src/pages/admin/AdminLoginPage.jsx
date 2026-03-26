import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminLoginPage = () => {
  const { signIn } = useAuth()
  const navigate   = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      navigate('/admin/counter')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-block bg-orange-500 px-4 py-2 mb-3 rotate-[-1deg]">
            <span className="font-black text-white text-3xl tracking-tight uppercase" style={{ fontFamily: 'Impact, sans-serif' }}>
              MAMASITA
            </span>
          </div>
          <p className="text-slate-400 text-sm uppercase tracking-widest font-mono">Staff Portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-slate-800 border border-slate-700 rounded-lg p-8 shadow-2xl">
          <h2 className="text-white font-bold text-xl mb-6 uppercase tracking-wide">Sign In</h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-widest font-mono mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors font-mono"
                placeholder="staff@mamasita.com"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-widest font-mono mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors font-mono"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded text-red-300 text-sm font-mono">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded uppercase tracking-widest text-sm transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-600 text-xs mt-6 font-mono">
          Customer ordering app → <a href="/" className="text-slate-400 hover:text-orange-500 transition-colors">/</a>
        </p>
      </div>
    </div>
  )
}

export default AdminLoginPage
