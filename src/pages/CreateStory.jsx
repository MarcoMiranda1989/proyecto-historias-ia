import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stories } from '../services/api';

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
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-10">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <span className="text-5xl block mb-3">✨</span>
            <h1 className="text-2xl font-bold text-gray-900 m-0">Nueva Historia</h1>
            <p className="text-gray-500 mt-1 text-sm">Crea un nuevo libro de historias con IA</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">
                Título del libro
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all box-border"
                placeholder="Ej: El viaje de Luna"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">
                Descripción (opcional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all box-border resize-none"
                placeholder="Una breve descripción de tu historia..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 border-none"
            >
              {loading ? 'Creando...' : 'Crear Historia'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
