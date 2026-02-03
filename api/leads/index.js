
import { getSupabaseClient } from '../_lib/supabase.js';

export default async function handler(req, res) {
    // Admin Only Route - Fail fast if no token
    if (!req.headers.authorization && req.method === 'GET') {
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    // Initialize client with user's JWT
    const supabase = getSupabaseClient(req);
    if (req.method === 'GET') {
        // Admin only
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const { data, error } = await supabase
                .from('leads')
                .select(`
                    *,
                    recruiters:recruiter_id (name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            res.json({ leads: data });
        } catch (error) {
            console.error('Error fetching leads:', error);
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'POST') {
        // Public submission
        try {
            const { recruiter_id, candidate_name, candidate_email, candidate_phone, preferred_windows } = req.body;

            const { data, error } = await supabase
                .from('leads')
                .insert([{ recruiter_id, candidate_name, candidate_email, candidate_phone, preferred_windows }]);

            if (error) throw error;
            res.status(201).json({ message: "Lead created" });
        } catch (error) {
            console.error('Error creating lead:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
