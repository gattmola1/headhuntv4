import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());
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
    const module = await import('./api/applications.js');
    adaptHandler(module.default)(req, res);
});

// Collaborators
app.all('/api/collaborators', async (req, res) => {
    const module = await import('./api/collaborators.js');
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
    // Vercel routes /api/admin/resume-link/[path]
    // We need to find where this file is. Inspecting api structure previously:
    // api/admin is a dir. Let's assume api/admin/resume-link.js or similar?
    // Based on previous list_dir of api/admin (numChildren: 1), it's likely.
    try {
        // Trying to resolve the likely path.
        // If the user's file structure uses [path].js inside resume-link folder:
        // api/admin/resume-link/[path].js 
        // But let's start with a generic try and debug if needed.
        // Actually, let's just make it try to import api/admin/resume-link.js if it exists.

        // Check if api/admin/resume-link.js exists
        if (fs.existsSync(join(__dirname, 'api/admin/resume-link.js'))) {
            req.query.path = req.params.path;
            const mod = await import('./api/admin/resume-link.js');
            return adaptHandler(mod.default)(req, res);
        }

    } catch (e) {
        console.error(e);
    }
    res.status(404).json({ error: "Endpoint not found in local server map" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Local API Server running on http://localhost:${PORT}`);
    console.log(`Proxying requests from Vite (http://localhost:5173/api) -> http://localhost:${PORT}/api`);
});
