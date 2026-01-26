const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const supabase = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
    console.error("CRITICAL ERROR: ADMIN_PASSWORD not set in environment variables.");
    process.exit(1);
}

app.use(cors());
app.use(express.json());

// Configure Multer for In-Memory uploads (needed for Supabase Storage)
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware to check Admin Password
const requireAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    if (token !== ADMIN_PASSWORD) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    next();
};

/* --- API ROUTES --- */

// Admin Login Check
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true, token: password });
    } else {
        res.status(401).json({ success: false, error: 'Invalid password' });
    }
});

// GET All Postings (Public)
app.get('/api/jobs', async (req, res) => {
    const { data, error } = await supabase
        .from('postings')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ jobs: data });
});

// CREATE Posting (Admin)
app.post('/api/jobs', requireAdmin, async (req, res) => {
    const { title, company, location, salary, description } = req.body;
    const { data, error } = await supabase
        .from('postings')
        .insert([{ title, company, location, salary: salary || null, description }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// DELETE Posting (Admin)
app.delete('/api/jobs/:id', requireAdmin, async (req, res) => {
    const { error } = await supabase
        .from('postings')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Deleted" });
});

// --- IDEAS ROUTES (Public) ---

app.get('/api/ideas', async (req, res) => {
    const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('total_hours', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ideas: data });
});

app.post('/api/ideas', async (req, res) => {
    const { title, department, description, total_hours } = req.body;
    const { data, error } = await supabase
        .from('ideas')
        .insert([{ title, department, description, total_hours: total_hours || 0, participants_count: 0 }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

app.delete('/api/ideas/:id', requireAdmin, async (req, res) => {
    const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Idea Deleted" });
});

// SUBMIT Application or Collaboration (Public)
app.post('/api/apply', upload.single('resume'), async (req, res) => {
    const { idea_id, posting_id, full_name, email, phone, linkedin_url, committed_hours } = req.body;
    const isCollaboration = !!committed_hours;

    if (!isCollaboration && !req.file) {
        return res.status(400).json({ error: 'Resume PDF is required for job applications.' });
    }

    try {
        if (isCollaboration) {
            // 1. Insert Collaborator
            const { data: collab, error: collabErr } = await supabase
                .from('collaborators')
                .insert([{ idea_id, full_name, email, phone, committed_hours: parseInt(committed_hours) }])
                .select();

            if (collabErr) throw collabErr;

            // 2. Update Idea participants/hours
            const { error: updateErr } = await supabase.rpc('increment_idea_stats', {
                row_id: idea_id,
                h_count: parseInt(committed_hours)
            });
            // Note: If you didn't create the RPC, we can do it via standard update
            if (updateErr) {
                const { data: idea } = await supabase.from('ideas').select('total_hours, participants_count').eq('id', idea_id).single();
                await supabase.from('ideas').update({
                    total_hours: (idea.total_hours || 0) + parseInt(committed_hours),
                    participants_count: (idea.participants_count || 0) + 1
                }).eq('id', idea_id);
            }

            res.json({ message: "Collaboration successful", id: collab[0].id });
        } else {
            // Traditional Application flow (Jobs)
            // 1. Upload to Supabase Storage
            const fileName = `resume-${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`;
            const { data: uploadData, error: uploadErr } = await supabase.storage
                .from('resumes')
                .upload(fileName, req.file.buffer, {
                    contentType: 'application/pdf',
                    upsert: false
                });

            if (uploadErr) throw uploadErr;

            // 2. Insert into Applications table
            const { data: appData, error: appErr } = await supabase
                .from('applications')
                .insert([{
                    posting_id,
                    full_name,
                    email,
                    phone,
                    linkedin_url,
                    resume_url: fileName // We store the PATH/KEY, not a URL
                }])
                .select();

            if (appErr) throw appErr;
            res.json({ message: "Application successful", id: appData[0].id });
        }
    } catch (err) {
        console.error('Apply Route Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET Secure Resume Link (Admin Only)
app.get('/api/admin/resume-link/:path', requireAdmin, async (req, res) => {
    const { path } = req.params;
    const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(path, 60); // Link valid for 60 seconds

    if (error) return res.status(500).json({ error: error.message });
    res.json({ url: data.signedUrl });
});

// GET Participants for a specific idea (used by ApplicationModal)
app.get('/api/jobs/:id/participants', async (req, res) => {
    const { data, error } = await supabase
        .from('collaborators')
        .select('full_name, committed_hours, created_at')
        .eq('idea_id', req.params.id)
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ participants: data });
});


// GET All Applications (Admin)
app.get('/api/applications', requireAdmin, async (req, res) => {
    const { data, error } = await supabase
        .from('applications')
        .select(`
            *,
            postings (title)
        `)
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    // Flatten the join result for compatibility with old frontend logic
    const formatted = data.map(app => ({
        ...app,
        job_title: app.postings ? app.postings.title : 'Unknown Job'
    }));

    res.json({ applications: formatted });
});

app.get('/api/collaborators', requireAdmin, async (req, res) => {
    const { data, error } = await supabase
        .from('collaborators')
        .select(`
            *,
            ideas (title, department)
        `)
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    const formatted = data.map(col => ({
        ...col,
        idea_title: col.ideas ? col.ideas.title : 'Deleted Idea',
        idea_entity: col.ideas ? col.ideas.department : 'Unknown'
    }));

    res.json({ collaborators: formatted });
});

// --- PROSPECTS ROUTES ---

app.get('/api/prospects', requireAdmin, async (req, res) => {
    const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ prospects: data });
});

app.post('/api/prospects', async (req, res) => {
    const { data, error } = await supabase
        .from('prospects')
        .insert([req.body])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

app.delete('/api/prospects/:id', requireAdmin, async (req, res) => {
    const { error } = await supabase
        .from('prospects')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Prospect Deleted" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File is too large. Max size is 5MB.' });
        }
        return res.status(400).json({ error: err.message });
    }
    if (err) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
    next();
});

// Export app for Vercel
module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
