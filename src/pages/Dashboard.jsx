import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { stories } from '../services/api';

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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 m-0">Mis Libros de Historias</h1>
            <p className="text-gray-500 text-sm mt-1">Tus historias creadas con IA</p>
          </div>
          <Link
            to="/create"
            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline inline-flex items-center gap-2"
          >
            + Nueva Historia
          </Link>
        </div>

        {storyList.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <span className="text-6xl block mb-4">📚</span>
            <h2 className="text-xl font-semibold text-gray-900 m-0 mb-2">No tienes historias aún</h2>
            <p className="text-gray-500 text-sm mb-6">Crea tu primer libro de historias con IA</p>
            <button
              onClick={() => navigate('/create')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none"
            >
              Crear mi primera historia
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {storyList.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 m-0 mb-2 truncate">
                    {story.title}
                  </h3>
                  {story.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {story.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mb-4">
                    Creado el {new Date(story.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      to={`/story/${story.id}`}
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-center py-2 rounded-lg text-sm font-medium transition-colors no-underline"
                    >
                      Ver
                    </Link>
                    <Link
                      to={`/story/${story.id}/add`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-2 rounded-lg text-sm font-medium transition-colors no-underline"
                    >
                      + Página
                    </Link>
                    <button
                      onClick={() => handleDelete(story.id)}
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm transition-colors cursor-pointer border-none"
                    >
                      🗑
                    </button>
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
