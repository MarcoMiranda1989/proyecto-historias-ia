import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/api';
import { User, Mail, Calendar, Loader2, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const data = await auth.updateProfile({ username });
      updateUser(data.user);
      setMessage('Perfil actualizado correctamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-md">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Ajustes de cuenta</h1>
          <p className="text-zinc-500 mt-2 text-sm">Gestiona tu información personal y preferencias.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200 overflow-hidden">
          
          {/* Header del Perfil */}
          <div className="px-6 py-8 border-b border-zinc-100 flex items-center gap-5">
            <div className="h-16 w-16 bg-zinc-100 rounded-full flex items-center justify-center shrink-0">
              <User className="h-7 w-7 text-zinc-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">{user?.username || 'Usuario'}</h2>
            <div className="flex items-center gap-1.5 text-sm text-zinc-500 mt-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {user?.created_at && !isNaN(new Date(user.created_at).getTime())
                  ? `Miembro desde ${new Date(user.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}`
                  : 'Miembro reciente'}
              </span>
            </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="p-6">
            {message && (
              <div className="mb-6 rounded-lg bg-emerald-50 p-4 flex items-center gap-3 text-sm font-medium text-emerald-800 border border-emerald-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                {message}
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800 border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-900 mb-2">
                  <User className="h-4 w-4 text-zinc-400" />
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-900 mb-2">
                  <Mail className="h-4 w-4 text-zinc-400" />
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="block w-full rounded-xl border-0 py-3 px-4 bg-zinc-50 text-zinc-500 shadow-sm ring-1 ring-inset ring-zinc-200 cursor-not-allowed sm:text-sm"
                />
                <p className="mt-2 text-xs text-zinc-400">El correo electrónico no puede ser modificado actualmente.</p>
              </div>

              <div className="pt-4 border-t border-zinc-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-70"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
