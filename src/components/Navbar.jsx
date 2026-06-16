import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-gray-800 font-semibold text-lg no-underline">
            <span className="text-2xl">📖</span>
            <span>Mis Historias IA</span>
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium no-underline"
              >
                Mis Libros
              </Link>
              <Link
                to="/profile"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium no-underline"
              >
                Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
