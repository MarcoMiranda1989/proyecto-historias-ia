import { Router } from 'express';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const [stories] = await pool.query(
      'SELECT * FROM stories WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ stories });
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ error: 'Error al obtener historias' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const [stories] = await pool.query(
      'SELECT * FROM stories WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (stories.length === 0) {
      return res.status(404).json({ error: 'Historia no encontrada' });
    }

    const [pages] = await pool.query(
      'SELECT * FROM story_pages WHERE story_id = ? ORDER BY page_number ASC',
      [req.params.id]
    );

    res.json({ story: stories[0], pages });
  } catch (error) {
    console.error('Get story error:', error);
    res.status(500).json({ error: 'Error al obtener historia' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'El título es obligatorio' });
    }

    const [result] = await pool.query(
      'INSERT INTO stories (user_id, title, description) VALUES (?, ?, ?)',
      [req.user.id, title, description || '']
    );

    const [story] = await pool.query('SELECT * FROM stories WHERE id = ?', [result.insertId]);

    res.status(201).json({ story: story[0] });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ error: 'Error al crear historia' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    const [stories] = await pool.query(
      'SELECT id FROM stories WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (stories.length === 0) {
      return res.status(404).json({ error: 'Historia no encontrada' });
    }

    await pool.query(
      'UPDATE stories SET title = COALESCE(?, title), description = COALESCE(?, description) WHERE id = ?',
      [title, description, req.params.id]
    );

    const [story] = await pool.query('SELECT * FROM stories WHERE id = ?', [req.params.id]);

    res.json({ story: story[0] });
  } catch (error) {
    console.error('Update story error:', error);
    res.status(500).json({ error: 'Error al actualizar historia' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const [stories] = await pool.query(
      'SELECT id FROM stories WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (stories.length === 0) {
      return res.status(404).json({ error: 'Historia no encontrada' });
    }

    await pool.query('DELETE FROM story_pages WHERE story_id = ?', [req.params.id]);
    await pool.query('DELETE FROM stories WHERE id = ?', [req.params.id]);

    res.json({ message: 'Historia eliminada correctamente' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ error: 'Error al eliminar historia' });
  }
});

router.post('/:id/pages', auth, async (req, res) => {
  try {
    const { prompt, image_url, text } = req.body;

    const [stories] = await pool.query(
      'SELECT id FROM stories WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (stories.length === 0) {
      return res.status(404).json({ error: 'Historia no encontrada' });
    }

    const [maxPage] = await pool.query(
      'SELECT COALESCE(MAX(page_number), 0) + 1 AS next_page FROM story_pages WHERE story_id = ?',
      [req.params.id]
    );

    const page_number = maxPage[0].next_page;

    const [result] = await pool.query(
      'INSERT INTO story_pages (story_id, page_number, prompt, image_url, text) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, page_number, prompt, image_url, text || '']
    );

    const [page] = await pool.query('SELECT * FROM story_pages WHERE id = ?', [result.insertId]);

    res.status(201).json({ page: page[0] });
  } catch (error) {
    console.error('Add page error:', error);
    res.status(500).json({ error: 'Error al agregar página' });
  }
});

router.delete('/:storyId/pages/:pageId', auth, async (req, res) => {
  try {
    const [stories] = await pool.query(
      'SELECT id FROM stories WHERE id = ? AND user_id = ?',
      [req.params.storyId, req.user.id]
    );

    if (stories.length === 0) {
      return res.status(404).json({ error: 'Historia no encontrada' });
    }

    await pool.query(
      'DELETE FROM story_pages WHERE id = ? AND story_id = ?',
      [req.params.pageId, req.params.storyId]
    );

    res.json({ message: 'Página eliminada correctamente' });
  } catch (error) {
    console.error('Delete page error:', error);
    res.status(500).json({ error: 'Error al eliminar página' });
  }
});

export default router;
