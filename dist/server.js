"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_router_1 = require("./modules/auth/auth.router");
const users_router_1 = require("./modules/users/users.router");
const voters_router_1 = require("./modules/voters/voters.router");
const events_router_1 = require("./modules/events/events.router");
const territory_router_1 = require("./modules/territory/territory.router");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Middlewares globales
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Rutas de API REST v1
app.use('/api/v1/auth', auth_router_1.authRouter);
app.use('/api/v1/users', users_router_1.usersRouter);
app.use('/api/v1/voters', voters_router_1.votersRouter);
app.use('/api/v1/events', events_router_1.eventsRouter);
app.use('/api/v1/territory', territory_router_1.territoryRouter);
// Health Check Endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'online',
        app: 'SIGE Electoral - Redter Inteligencia',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
    });
});
// Servir frontend compilado estático (Hostinger LiteSpeed / Node fallback)
const clientDistPath = path_1.default.join(__dirname, '../client/dist');
app.use(express_1.default.static(clientDistPath));
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'Ruta de API no encontrada' });
    }
    res.sendFile(path_1.default.join(clientDistPath, 'index.html'), (err) => {
        if (err) {
            res.status(200).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>SIGE Electoral - Redter Inteligencia</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; display: grid; place-content: center; height: 100vh; margin: 0; }
            .card { background: #1e293b; padding: 2.5rem; border-radius: 1rem; border: 1px solid #334155; max-width: 500px; text-align: center; }
            h1 { color: #38bdf8; margin-top: 0; }
            code { background: #0f172a; padding: 0.2rem 0.5rem; border-radius: 0.3rem; color: #f43f5e; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>SIGE Electoral (Redter Inteligencia)</h1>
            <p>API REST Node.js activa en puerto <strong>${PORT}</strong>.</p>
            <p>El cliente Frontend está listo para compilarse con <code>npm run build</code>.</p>
          </div>
        </body>
        </html>
      `);
        }
    });
});
app.listen(PORT, () => {
    console.log(`🚀 SIGE Electoral API corriendo en http://localhost:${PORT}`);
});
