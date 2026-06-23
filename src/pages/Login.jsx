import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Lado Izquierdo: Formulario */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          
          {/* Cabecera */}
          <div className="mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-md">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="mt-8 text-3xl font-bold tracking-tight text-zinc-900">
              Bienvenido de vuelta
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Continúa creando historias increíbles con IA.
            </p>
          </div>

          {/* Alerta de Error */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800 border border-red-100">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full justify-center items-center gap-2 rounded-xl bg-zinc-950 px-3 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:opacity-70 transition-all"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Entrar a mi cuenta'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            ¿No tienes cuenta?{' '}
            <motion.div
              className="inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/register" className="font-semibold text-zinc-950 hover:text-zinc-700 hover:underline">
                Regístrate aquí
              </Link>
            </motion.div>
          </p>
        </div>
      </div>

      {/* Lado Derecho: Arte */}
      <div className="hidden lg:relative lg:flex lg:flex-1 lg:items-center lg:justify-center bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-zinc-950"></div>
        <div className="relative z-10 text-center px-12">
          <h3 className="text-4xl font-bold text-white tracking-tight mb-4">
            Tu imaginación,<br/>potenciada por IA.
          </h3>
          <p className="text-zinc-400 text-lg">
            Genera textos e imágenes únicas para dar vida a tus ideas en segundos.
          </p>
        </div>
      </div>
    </div>
  );
}