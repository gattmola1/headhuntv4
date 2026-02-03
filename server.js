import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();
// Vite/Vercel priority: .env.local overrides .env
if (fs.existsSync('.env.local')) {
    dotenv.config({ path: '.env.local', override: true });
}

const app = express();
const PORT = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.ALLOWED_ORIGIN
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl) 
        // or if the origin is in our allowed list
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`Blocked CORS request from origin: ${origin}`);
            callback(new Error('Blocked by CORS: You are not on the guest list!'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// verify env vars
console.log('--- Environment Check ---');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'MISSING');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set (starts with ' + process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 5) + '...)' : 'MISSING');
console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? 'Set' : 'MISSING');
console.log('-------------------------');

// Logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Helper to normalize Vercel handler for Express
const adaptHandler = (handler) => async (req, res) => {
    try {
        await handler(req, res);
    } catch (err) {
        console.error('API Error:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

// Define Routes
// Explicitly map paths to match Vercel's file-system routing

// Jobs
app.all('/api/jobs', async (req, res) => {
    const module = await import('./api/jobs/index.js');
    adaptHandler(module.default)(req, res);
});
app.all('/api/jobs/:id', async (req, res) => {
    req.query.id = req.params.id; // Simulate Vercel query param
    const module = await import('./api/jobs/[id].js');
    adaptHandler(module.default)(req, res);
});

// Applications
app.all('/api/applications', async (req, res) => {
    const module = await import('./api/applications/index.js');
    adaptHandler(module.default)(req, res);
});
app.all('/api/applications/:id', async (req, res) => {
    req.query.id = req.params.id;
    const module = await import('./api/applications/[id].js');
    adaptHandler(module.default)(req, res);
});

// Collaborators
app.all('/api/collaborators', async (req, res) => {
    const module = await import('./api/collaborators/index.js');
    adaptHandler(module.default)(req, res);
});
app.all('/api/collaborators/:id', async (req, res) => {
    req.query.id = req.params.id;
    const module = await import('./api/collaborators/[id].js');
    adaptHandler(module.default)(req, res);
});

// Ideas
app.all('/api/ideas', async (req, res) => {
    const module = await import('./api/ideas/index.js');
    adaptHandler(module.default)(req, res);
});
app.all('/api/ideas/:id', async (req, res) => {
    req.query.id = req.params.id;
    const module = await import('./api/ideas/[id].js');
    adaptHandler(module.default)(req, res);
});
app.all('/api/ideas/:id/participants', async (req, res) => {
    console.log(`[Server] Route matched for participants. Params:`, req.params);
    // Force recreate req.query to ensure it's writable and includes 'id'
    req.query = { ...req.query, id: req.params.id };
    console.log(`[Server] Assigned req.query.id = ${req.query.id}`);
    const module = await import('./api/ideas/[id]/participants.js');
    adaptHandler(module.default)(req, res);
});

// Prospects
app.all('/api/prospects', async (req, res) => {
    const module = await import('./api/prospects/index.js');
    adaptHandler(module.default)(req, res);
});
app.all('/api/prospects/:id', async (req, res) => {
    req.query.id = req.params.id;
    const module = await import('./api/prospects/[id].js');
    adaptHandler(module.default)(req, res);
});

// Recruiters
app.all('/api/recruiters', async (req, res) => {
    const module = await import('./api/recruiters/index.js');
    adaptHandler(module.default)(req, res);
});
app.all('/api/recruiters/:id', async (req, res) => {
    req.query.id = req.params.id;
    const module = await import('./api/recruiters/[id].js');
    adaptHandler(module.default)(req, res);
});
app.all('/api/recruiters/slug/:slug', async (req, res) => {
    // req.query is read-only in some environments, handle slug extraction in handler or via fallback
    // req.query.slug = req.params.slug;
    const module = await import('./api/recruiters/slug/[slug].js');
    adaptHandler(module.default)(req, res);
});

// Leads
app.all('/api/leads', async (req, res) => {
    const module = await import('./api/leads/index.js');
    adaptHandler(module.default)(req, res);
});

// Auth & Admin
app.all('/api/login', async (req, res) => {
    const module = await import('./api/login.js');
    adaptHandler(module.default)(req, res);
});
app.all('/api/apply', async (req, res) => {
    const module = await import('./api/apply.js');
    adaptHandler(module.default)(req, res);
});
// Special handling for resume-link if it's dynamic
app.all('/api/admin/resume-link/:path', async (req, res) => {
    try {
        req.query.path = req.params.path;
        const module = await import('./api/admin/resume-link/[path].js');
        adaptHandler(module.default)(req, res);
    } catch (e) {
        console.error('Route Error:', e);
        res.status(404).json({ error: "Endpoint not found in local server map" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Local API Server running on http://localhost:${PORT}`);
    console.log(`Proxying requests from Vite (http://localhost:5173/api) -> http://localhost:${PORT}/api`);
});
