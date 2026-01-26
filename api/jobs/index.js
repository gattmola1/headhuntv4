import { supabase } from '../_lib/supabase.js';
import { checkAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { data, error } = await supabase
            .from('postings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ jobs: data });
    }

    if (req.method === 'POST') {
        if (!checkAdmin(req)) return res.status(403).json({ error: 'Forbidden' });

        const { title, company, location, salary, description } = req.body;
        const { data, error } = await supabase
            .from('postings')
            .insert([{ title, company, location, salary: salary || null, description }])
            .select();

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data[0]);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}
