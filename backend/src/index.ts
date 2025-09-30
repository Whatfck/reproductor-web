import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { json } from 'express';
import { initDb } from './db/database';
import songRoutes from './routes/songRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(json());

initDb();

app.use('/api/songs', songRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('🎶 Backend del Reproductor de Música activo!');
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
