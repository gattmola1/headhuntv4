import { supabase } from '../../../_lib/supabase.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { id } = req.query;

    const { data, error } = await supabase
        .from('collaborators')
        .select('full_name, committed_hours, created_at')
        .eq('idea_id', id)
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ participants: data });
}
