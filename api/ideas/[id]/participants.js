import { getSupabaseClient } from '../../_lib/supabase.js';

export default async function handler(req, res) {
    const supabase = getSupabaseClient(req);
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { id } = req.query;
    console.log(`[API] Fetching participants for idea_id: ${id}`);

    const { data, error } = await supabase
        .rpc('get_idea_participants_safe', { target_idea_id: id });

    if (error) {
        console.error('[API] Error fetching participants:', error);
        return res.status(500).json({ error: error.message });
    }

    console.log(`[API] Found ${data?.length || 0} participants found for idea_id: ${id}`);
    return res.status(200).json({ participants: data });
}
