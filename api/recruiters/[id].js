
import { getSupabaseClient } from '../../_lib/supabase.js';

export default async function handler(req, res) {
    const supabase = getSupabaseClient(req);
    const { id } = req.query;

    // Check Auth
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'PUT') {
        try {
            const { name, bio, highlights, calendar_id, slug, headshot_url } = req.body;
            const { data, error } = await supabase
                .from('recruiters')
                .update({ name, bio, highlights, calendar_id, slug, headshot_url })
                .eq('id', id)
                .select();

            if (error) throw error;
            res.json({ recruiter: data[0] });
        } catch (error) {
            console.error('Error updating recruiter:', error);
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'DELETE') {
        try {
            const { error } = await supabase
                .from('recruiters')
                .delete()
                .eq('id', id);

            if (error) throw error;
            res.status(204).end();
        } catch (error) {
            console.error('Error deleting recruiter:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
