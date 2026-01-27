import { supabase } from '../_lib/supabase.js';
import { checkAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const isAdmin = checkAdmin(req);
        console.log(`[API] GET /api/prospects - Admin Authenticated: ${isAdmin}`);

        if (!isAdmin) return res.status(403).json({ error: 'Forbidden' });

        const { data, error } = await supabase
            .from('prospects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[API] Supabase Error (prospects):', error);
            return res.status(500).json({ error: error.message });
        }

        console.log(`[API] Success - Found ${data?.length || 0} prospects`);
        return res.status(200).json({ prospects: data });
    }

    if (req.method === 'POST') {
        const { data, error } = await supabase
            .from('prospects')
            .insert([req.body])
            .select();

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data[0]);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}
