import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { stories } from '../services/api';
import { BookPlus, ArrowLeft, Loader2 } from 'lucide-react';

export default function CreateStory() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await stories.create({ title, description });
      navigate(`/story/${data.story.id}/add`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Volver al Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200 p-8 sm:p-10">
          <div className="mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 mb-6">
              <BookPlus className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 m-0">Nueva Historia</h1>
            <p className="text-zinc-500 mt-2 text-sm">Define el título y la premisa de tu próximo libro generado con IA.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-800 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-2">
                Título del libro
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6 transition-all"
                placeholder="Ej: El viaje estelar de Luna"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-2">
                Descripción <span className="text-zinc-400 font-normal">(Opcional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6 transition-all resize-none"
                placeholder="Una breve sinopsis de lo que tratará tu historia..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex justify-center items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white py-3.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Crear Historia'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}