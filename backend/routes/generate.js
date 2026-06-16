import { Router } from 'express';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/image', auth, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'El prompt es obligatorio' });
    }

    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;

    res.json({ imageUrl });
  } catch (error) {
    console.error('Generate image error:', error);
    res.status(500).json({ error: 'Error al generar imagen' });
  }
});

router.post('/story-text', auth, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'El prompt es obligatorio' });
    }

    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: `Genera un texto corto para una página de libro infantil (máximo 50 palabras) basado en: ${prompt}. Responde solo el texto de la historia.`,
          },
        ],
      }),
    });

    const text = await response.text();

    res.json({ text: text.trim() });
  } catch (error) {
    console.error('Generate text error:', error);
    res.status(500).json({ error: 'Error al generar texto' });
  }
});

export default router;
