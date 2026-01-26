import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    // Only log in development or if strict checks are needed
    console.warn('Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing.');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
