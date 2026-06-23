import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, User, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
       
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-zinc-900">
            <div className="bg-zinc-900 p-1.5 rounded-lg text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <span>Mis Historias IA</span>
          </Link>

       
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Mis Libros
            </Link>
            <Link to="/profile" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors flex items-center gap-2">
              <User className="h-4 w-4" />
              Perfil
            </Link>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-900 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}