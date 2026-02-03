
import { getSupabaseClient } from '../_lib/supabase.js';

export default async function handler(req, res) {
    // Public GET is allowed by RLS (anon), but POST requires auth
    if (req.method === 'POST' && !req.headers.authorization) {
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    const supabase = getSupabaseClient(req);
    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('recruiters')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            res.json({ recruiters: data });
        } catch (error) {
            console.error('Error fetching recruiters:', error);
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'POST') {
        try {
            // Basic auth check (replace with middleware in prod)
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const { name, bio, highlights, calendar_id, slug, headshot_url } = req.body;

            // Auto-generate slug if not provided? Or enforcement?
            // For now, assume admin provides it or we slugify name
            const finalSlug = slug || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

            const { data, error } = await supabase
                .from('recruiters')
                .insert([{ name, bio, highlights, calendar_id, slug: finalSlug, headshot_url }])
                .select();

            if (error) throw error;
            res.status(201).json({ recruiter: data[0] });
        } catch (error) {
            console.error('Error creating recruiter:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
