
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
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
                .insert([{ recruiter_id, candidate_name, candidate_email, candidate_phone, preferred_windows }])
                .select();

            if (error) throw error;
            res.status(201).json({ lead: data[0] });
        } catch (error) {
            console.error('Error creating lead:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
