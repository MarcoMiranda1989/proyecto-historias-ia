import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { stories } from '../services/api';
import { ArrowLeft, Plus, BookOpen, ChevronRight } from 'lucide-react';

export default function StoryView() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => { const load = async () => { 
    try { const data = await stories.getOne(id); 
      setStory(data.story); 
      setPages(data.pages); }
    catch (err) { alert(err.message); } 
    finally { setLoading(false); } }; 
    load(); }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  if (!story) return <div className="min-h-screen flex justify-center items-center bg-zinc-50 text-zinc-500">Historia no encontrada</div>;

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Volver a mis libros
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">{story.title}</h1>
            {story.description && (
              <p className="mt-3 text-lg text-zinc-500 max-w-2xl">{story.description}</p>
            )}
          </div>
          <Link
            to={`/story/${id}/add`}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-all"
          >
            <Plus className="h-4 w-4" /> Añadir página
          </Link>
        </div>

        {pages.length === 0 ? (
          <div className="relative block w-full rounded-2xl border-2 border-dashed border-zinc-300 p-16 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-zinc-300" />
            <h2 className="mt-4 text-lg font-semibold text-zinc-900">Libro en blanco</h2>
            <p className="mt-2 text-sm text-zinc-500 mb-6">Aún no hay páginas. Comienza a ilustrar y escribir tu historia.</p>
            <Link to={`/story/${id}/add`} className="inline-flex items-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700">
              Crear la primera página
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {pages.sort((a, b) => a.page_number - b.page_number).map((page) => (
              <article key={page.id} className="bg-white rounded-3xl shadow-sm ring-1 ring-zinc-200 overflow-hidden flex flex-col md:flex-row">
                {/* Lado Imagen */}
                <div className="md:w-1/2 bg-zinc-100 flex-shrink-0">
                  <img
                    src={page.image_url}
                    alt={page.prompt}
                    className="w-full h-full object-cover aspect-square md:aspect-auto"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=Imagen+no+disponible'; }}
                  />
                </div>
                {/* Lado Texto */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-6 block">
                    Página {page.page_number}
                  </span>
                  {page.text && (
                    <p className="text-zinc-800 text-lg leading-relaxed mb-8 font-serif">
                      {page.text}
                    </p>
                  )}
                  <details className="mt-auto pt-6 border-t border-zinc-100 group">
                    <summary className="text-xs font-medium text-zinc-400 cursor-pointer flex items-center gap-1 hover:text-zinc-600 transition-colors list-none">
                      <ChevronRight className="h-3 w-3 group-open:rotate-90 transition-transform" />
                      Ver prompt original
                    </summary>
                    <p className="mt-3 text-sm text-zinc-500 italic pl-4 border-l-2 border-zinc-200">{page.prompt}</p>
                  </details>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}