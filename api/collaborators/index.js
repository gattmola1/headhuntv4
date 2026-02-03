import { getSupabaseClient } from '../_lib/supabase.js';
import { checkAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const isAdmin = await checkAdmin(req);
    console.log(`[API] GET /api/collaborators - Admin Authenticated: ${isAdmin}`);

    if (!isAdmin) return res.status(403).json({ error: 'Forbidden' });

    const supabase = getSupabaseClient(req);

    const { data, error } = await supabase
        .from('collaborators')
        .select(`
        *,
        ideas (title, department)
    `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[API] Supabase Error (collaborators):', error);
        return res.status(500).json({ error: error.message });
    }

    console.log(`[API] Success - Found ${data?.length || 0} collaborators`);

    const formatted = data.map(col => ({
        ...col,
        idea_title: col.ideas ? col.ideas.title : 'Deleted Idea',
        idea_entity: col.ideas ? col.ideas.department : 'Unknown'
    }));

    return res.status(200).json({ collaborators: formatted });
}
