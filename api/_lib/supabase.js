import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.PROD_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_PROD_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.PROD_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Supabase URL or Anon Key missing.');
}

/**
 * Creates a Supabase client ensuring RLS policies are respected.
 * If an Authorization header is present, it injects the JWT.
 * @param {Object} req - The request object
 * @returns {Object} Supabase client instance
 */
export const getSupabaseClient = (req) => {
    const client = createClient(supabaseUrl || '', supabaseAnonKey || '', {
        global: {
            headers: {
                // Pass the user's JWT if it exists, otherwise it stays Anon
                Authorization: req?.headers?.authorization,
            },
        },
    });
    return client;
};

// Default export for backward compatibility relative to simple scripts, 
// but API routes should prefer getSupabaseClient(req)
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
