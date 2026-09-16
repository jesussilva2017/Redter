import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

import { authRouter } from './modules/auth/auth.router';
import { usersRouter } from './modules/users/users.router';
import { votersRouter } from './modules/voters/voters.router';
import { eventsRouter } from './modules/events/events.router';
import { territoryRouter } from './modules/territory/territory.router';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de API REST v1
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/voters', votersRouter);
app.use('/api/v1/events', eventsRouter);
app.use('/api/v1/territory', territoryRouter);

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
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Ruta de API no encontrada' });
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
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
