"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../db/database");
const router = (0, express_1.Router)();
// Obtener todas las canciones
router.get('/', async (_req, res, next) => {
    try {
        const db = (0, database_1.getDb)();
        const songs = await db.all('SELECT * FROM songs');
        res.json(songs);
    }
    catch (err) {
        next(err);
    }
});
// Agregar una canción
router.post('/', async (req, res, next) => {
    try {
        const { title, artist, album, year, filePath } = req.body;
        const db = (0, database_1.getDb)();
        const result = await db.run('INSERT INTO songs (title, artist, album, year, filePath) VALUES (?, ?, ?, ?, ?)', title, artist, album, year, filePath);
        res.json({ id: result.lastID, title, artist, album, year, filePath });
    }
    catch (err) {
        next(err);
    }
});
// Eliminar una canción
router.delete('/:id', async (req, res, next) => {
    try {
        const db = (0, database_1.getDb)();
        await db.run('DELETE FROM songs WHERE id = ?', req.params.id);
        res.json({ success: true });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
