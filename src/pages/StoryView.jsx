import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { stories } from '../services/api';

export default function StoryView() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await stories.getOne(id);
        setStory(data.story);
        setPages(data.pages);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Historia no encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 no-underline mb-2 block">
              ← Volver a mis libros
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 m-0">{story.title}</h1>
            {story.description && (
              <p className="text-gray-500 text-sm mt-1">{story.description}</p>
            )}
          </div>
          <Link
            to={`/story/${id}/add`}
            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline"
          >
            + Agregar Página
          </Link>
        </div>

        {pages.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <span className="text-6xl block mb-4">🖼️</span>
            <h2 className="text-xl font-semibold text-gray-900 m-0 mb-2">Este libro está vacío</h2>
            <p className="text-gray-500 text-sm mb-6">Agrega páginas con imágenes generadas por IA</p>
            <Link
              to={`/story/${id}/add`}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline inline-block"
            >
              Agregar primera página
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {pages
              .sort((a, b) => a.page_number - b.page_number)
              .map((page) => (
                <div
                  key={page.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-center bg-gray-50 p-4">
                      <img
                        src={page.image_url}
                        alt={page.prompt}
                        className="w-full max-w-sm rounded-lg shadow-sm"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
                        }}
                      />
                    </div>
                    <div className="p-6 flex flex-col justify-center">
                      <span className="text-xs text-gray-400 font-medium mb-2">
                        Página {page.page_number}
                      </span>
                      {page.text && (
                        <p className="text-gray-700 text-base leading-relaxed mb-4">
                          {page.text}
                        </p>
                      )}
                      <details className="text-sm text-gray-400">
                        <summary className="cursor-pointer hover:text-gray-600">Ver prompt</summary>
                        <p className="mt-2 text-gray-500 italic">{page.prompt}</p>
                      </details>
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
