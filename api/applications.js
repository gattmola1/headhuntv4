import { supabase } from '../_lib/supabase.js';
import { checkAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!checkAdmin(req)) return res.status(403).json({ error: 'Forbidden' });

    const { data, error } = await supabase
        .from('applications')
        .select(`
        *,
        postings (title)
    `)
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    const formatted = data.map(app => ({
        ...app,
        job_title: app.postings ? app.postings.title : 'Unknown Job'
    }));

    return res.status(200).json({ applications: formatted });
}
