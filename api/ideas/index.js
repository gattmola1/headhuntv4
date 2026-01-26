import { supabase } from '../_lib/supabase.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { data, error } = await supabase
            .from('ideas')
            .select('*')
            .order('total_hours', { ascending: false });

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ ideas: data });
    }

    if (req.method === 'POST') {
        const { title, department, description, total_hours } = req.body;
        const { data, error } = await supabase
            .from('ideas')
            .insert([{ title, department, description, total_hours: total_hours || 0, participants_count: 0 }])
            .select();

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data[0]);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}
