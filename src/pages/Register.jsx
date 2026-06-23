import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, Loader2 } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200 p-8 sm:p-10">
          
          {/* Cabecera */}
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 mb-6">
              <UserPlus className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 m-0">Crear Cuenta</h1>
            <p className="text-zinc-500 mt-2 text-sm">
              Regístrate para comenzar a crear tus historias.
            </p>
          </div>

          {/* Alerta de Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-800 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-900 mb-2">
                <User className="h-4 w-4 text-zinc-400" />
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm transition-all"
                placeholder="Tu nombre de usuario"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-900 mb-2">
                <Mail className="h-4 w-4 text-zinc-400" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm transition-all"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-900 mb-2">
                <Lock className="h-4 w-4 text-zinc-400" />
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm transition-all"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex justify-center items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white py-3.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Crear Cuenta'}
            </button>
          </form>

          {/* Footer del formulario */}
          <p className="text-center text-sm text-zinc-500 mt-8">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-zinc-900 font-semibold hover:underline transition-all">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
