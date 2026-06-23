import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { stories } from '../services/api';
import { Plus, Book, Trash2, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const [storyList, setStoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadStories = async () => {

    try {

      const data = await stories.getAll();

      setStoryList(data.stories);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => { loadStories(); }, []);



  const handleDelete = async (id) => {

    if (!confirm('¿Eliminar esta historia?')) return;

    try {

      await stories.delete(id);

      setStoryList((prev) => prev.filter((s) => s.id !== id));

    } catch (err) {

      alert(err.message);

    }

  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        
        {/* Cabecera del Dashboard */}
        <div className="sm:flex sm:items-center sm:justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Mis Historias</h1>
            <p className="mt-2 text-sm text-zinc-500">Gestiona y edita tus libros creados con IA.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-all"
            >
              <Plus className="h-4 w-4" />
              Nueva Historia
            </Link>
          </div>
        </div>

        {storyList.length === 0 ? (
          <div className="relative block w-full rounded-2xl border-2 border-dashed border-zinc-300 p-16 text-center hover:border-zinc-400 transition-colors">
            <Book className="mx-auto h-12 w-12 text-zinc-300" />
            <h3 className="mt-4 text-lg font-semibold text-zinc-900">Ninguna historia aún</h3>
            <p className="mt-2 text-sm text-zinc-500 mb-6">Tu estantería está vacía. Comienza creando tu primer libro.</p>
            <button
              onClick={() => navigate('/create')}
              className="inline-flex items-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
            >
              Empezar ahora
            </button>
          </div>
        ) : (
          /* Grid de Historias */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {storyList.map((story) => (
              <div
                key={story.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 transition-all hover:shadow-md hover:ring-zinc-300"
              >
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 line-clamp-1">
                    {story.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500 line-clamp-2">
                    {story.description || "Sin descripción"}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4">
                  <div className="text-xs text-zinc-400 font-medium">
                    {new Date(story.created_at).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(story.id)}
                      className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Link
                      to={`/story/${story.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition-colors"
                    >
                      Ver
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
