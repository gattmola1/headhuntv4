import { supabase } from '../_lib/supabase.js';
import { checkAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!checkAdmin(req)) return res.status(403).json({ error: 'Forbidden' });

    const { id } = req.query;

    const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: "Idea Deleted" });
}
