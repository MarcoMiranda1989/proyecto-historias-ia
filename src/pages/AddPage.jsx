import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { generate, stories } from '../services/api';
import { ArrowLeft, Wand2, Image as ImageIcon, AlignLeft, Download, Trash2, Save, Loader2 } from 'lucide-react';

export default function AddPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatingText, setGeneratingText] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

 
  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;
    setGeneratingImage(true);
    setError('');

    try {
      const data = await generate.image({ prompt });
      setImageUrl(data.imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleGenerateText = async () => {
    if (!prompt.trim()) return;
    setGeneratingText(true);
    setError('');

    try {
      const data = await generate.storyText({ prompt });
      setGeneratedText(data.text);
    } catch (err) {
      setError(err.message);
    } finally {
      setGeneratingText(false);
    }
  };

  const handleSave = async () => {
    if (!imageUrl) {
      setError('Primero genera una imagen');
      return;
    }
    setSaving(true);
    setError('');

    try {
      await stories.addPage(id, {
        prompt,
        image_url: imageUrl,
        text: generatedText,
      });
      navigate(`/story/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pagina-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Error al descargar la imagen');
    }
  };
  
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link to={`/story/${id}`} className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Volver a la historia
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Añadir Página</h1>
          <p className="text-zinc-500 mt-2">Describe la escena y deja que la IA cree la magia.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-800 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Panel Izquierdo: Controles */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200 p-6">
              <label className="block text-sm font-medium text-zinc-900 mb-2">
                Prompt de la escena
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6 transition-all resize-none mb-4"
                placeholder="Ej: Un conejo blanco en un bosque mágico con flores que brillan en la oscuridad, estilo acuarela..."
              />
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleGenerateImage}
                  disabled={generatingImage || !prompt.trim()}
                  className="w-full flex justify-center items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-70"
                >
                  {generatingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                  {generatingImage ? 'Generando...' : 'Generar Imagen'}
                </button>
                <button
                  onClick={handleGenerateText}
                  disabled={generatingText || !prompt.trim()}
                  className="w-full flex justify-center items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-900 ring-1 ring-inset ring-zinc-200 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-70"
                >
                  {generatingText ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlignLeft className="h-4 w-4" />}
                  {generatingText ? 'Escribiendo...' : 'Generar Texto para la historia'}
                </button>
              </div>
            </div>

            {/* Texto Generado Preview */}
            {generatedText && (
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200 p-6 relative group">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-zinc-900 flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-zinc-500" />
                    Texto de la página
                  </h3>
                  <button onClick={() => setGeneratedText('')} className="text-zinc-400 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-wrap">{generatedText}</p>
              </div>
            )}
          </div>

          {/* Panel Derecho: Preview Visual */}
          <div className="lg:col-span-7 flex flex-col">
            <div className={`flex-1 rounded-2xl border-2 ${imageUrl ? 'border-transparent bg-zinc-100 p-2' : 'border-dashed border-zinc-300'} flex flex-col items-center justify-center overflow-hidden min-h-[400px]`}>
              {!imageUrl ? (
                <div className="text-center p-8">
                  <ImageIcon className="mx-auto h-12 w-12 text-zinc-300 mb-3" />
                  <p className="text-sm text-zinc-500">La imagen generada aparecerá aquí</p>
                </div>
              ) : (
                <div className="w-full relative group">
                  <img src={imageUrl} alt="Generada" className="w-full h-auto rounded-xl shadow-sm object-cover" />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleDownload} className="p-2.5 bg-white/90 backdrop-blur-sm text-zinc-900 rounded-lg shadow-sm hover:bg-white transition-colors" title="Descargar">
                      <Download className="h-4 w-4" />
                    </button>
                    <button onClick={() => setImageUrl('')} className="p-2.5 bg-white/90 backdrop-blur-sm text-red-600 rounded-lg shadow-sm hover:bg-white transition-colors" title="Quitar">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Botón Final de Guardado */}
            <div className="mt-6 flex justify-end">
               <button
                onClick={handleSave}
                disabled={saving || !imageUrl}
                className="flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white px-8 py-3.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {saving ? 'Guardando...' : 'Guardar en la historia'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
