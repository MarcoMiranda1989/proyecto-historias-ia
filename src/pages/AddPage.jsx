import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { generate, stories } from '../services/api';

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
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <Link to={`/story/${id}`} className="text-sm text-gray-500 hover:text-gray-700 no-underline mb-6 block">
          ← Volver a la historia
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <span className="text-5xl block mb-3">🎨</span>
            <h1 className="text-2xl font-bold text-gray-900 m-0">Nueva Página</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Genera una imagen con IA para tu historia
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">
                Describe la escena (prompt)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all box-border resize-none"
                placeholder="Ej: Un conejo blanco en un bosque mágico con flores brillantes"
              />
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleGenerateImage}
                disabled={generatingImage || !prompt.trim()}
                className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 border-none flex items-center gap-2"
              >
                {generatingImage ? 'Generando...' : '🎨 Generar Imagen'}
              </button>
              <button
                onClick={handleGenerateText}
                disabled={generatingText || !prompt.trim()}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 border-none flex items-center gap-2"
              >
                {generatingText ? 'Generando...' : '📝 Generar Texto'}
              </button>
            </div>

            {imageUrl && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Imagen generada
                </label>
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center gap-4">
                  <img
                    src={imageUrl}
                    alt="Generada por IA"
                    className="w-full max-w-sm rounded-lg shadow-sm"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleDownload}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none"
                    >
                      ⬇ Descargar
                    </button>
                    <button
                      onClick={() => setImageUrl('')}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {generatedText && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Texto generado para la página
                </label>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 text-sm leading-relaxed">{generatedText}</p>
                  <button
                    onClick={() => setGeneratedText('')}
                    className="mt-2 text-red-500 text-xs hover:text-red-700 cursor-pointer bg-transparent border-none"
                  >
                    Eliminar texto
                  </button>
                </div>
              </div>
            )}

            {imageUrl && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 border-none mt-2"
              >
                {saving ? 'Guardando...' : '💾 Guardar Página en la Historia'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
