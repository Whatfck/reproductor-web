"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_2 = require("express");
const database_1 = require("./db/database");
const songRoutes_1 = __importDefault(require("./routes/songRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use((0, express_2.json)());
(0, database_1.initDb)();
app.use('/api/songs', songRoutes_1.default);
app.get('/', (_req, res) => {
    res.send('🎶 Backend del Reproductor de Música activo!');
});
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
