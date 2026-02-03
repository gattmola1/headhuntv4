
import { getSupabaseClient } from '../../_lib/supabase.js';

export default async function handler(req, res) {
    const supabase = getSupabaseClient(req);
    let { slug } = req.query;

    if (req.method === 'GET') {
        try {
            console.log(`[SlugHandler] Query Params:`, req.query);
            console.log(`[SlugHandler] Slug requested:`, slug);

            if (!slug && req.url) {
                const parts = req.url.split('?')[0].split('/');
                slug = parts[parts.length - 1];
                console.log(`[SlugHandler] Fallback extracted slug from URL: ${slug}`);
            }

            if (!slug) {
                return res.status(400).json({ error: 'Slug parameter is required' });
            }

            const { data, error } = await supabase
                .from('recruiters')
                .select('*')
                .eq('slug', slug);

            if (error) throw error;

            // Log what we found to debug
            console.log(`[SlugHandler] Found ${data ? data.length : 0} records for slug: ${slug}`);

            if (!data || data.length === 0) {
                return res.status(404).json({ error: 'Recruiter not found' });
            }

            res.json({ recruiter: data[0] });
        } catch (error) {
            console.error('Error fetching recruiter by slug:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
