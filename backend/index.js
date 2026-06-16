import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import authRoutes from './routes/auth.js';
import storiesRoutes from './routes/stories.js';
import generateRoutes from './routes/generate.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/generate', generateRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const initDB = async () => {
  try {
    const connection = await pool.getConnection();

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS stories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS story_pages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        story_id INT NOT NULL,
        page_number INT NOT NULL,
        prompt TEXT NOT NULL,
        image_url TEXT NOT NULL,
        text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      ALTER TABLE story_pages MODIFY COLUMN image_url TEXT NOT NULL
    `).catch(() => {});

    connection.release();
    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error.message);
    console.log('Esperando a que MySQL esté disponible...');
  }
};

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  initDB();
});
