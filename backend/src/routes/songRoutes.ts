import { Router, Request, Response, NextFunction } from 'express';
import { getDb } from '../db/database';
import { Song } from '../models/song';

const router = Router();

// Obtener todas las canciones
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDb();
    const songs = await db.all('SELECT * FROM songs');
    res.json(songs);
  } catch (err) {
    next(err);
  }
});

// Agregar una canción
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, artist, album, year, filePath } = req.body as Song;
    const db = getDb();
    const result = await db.run(
      'INSERT INTO songs (title, artist, album, year, filePath) VALUES (?, ?, ?, ?, ?)',
      title, artist, album, year, filePath
    );
    res.json({ id: result.lastID, title, artist, album, year, filePath });
  } catch (err) {
    next(err);
  }
});

// Eliminar una canción
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDb();
    await db.run('DELETE FROM songs WHERE id = ?', req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
