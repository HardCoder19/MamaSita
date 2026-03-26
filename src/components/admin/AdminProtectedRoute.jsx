import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-400 text-sm font-mono uppercase tracking-widest">Loading…</p>
        </div>
      </div>
    )
  }

  if (!session) return <Navigate to="/admin/login" replace />
  return children
}

export default AdminProtectedRoute
