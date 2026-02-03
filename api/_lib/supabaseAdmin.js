import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.PROD_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_PROD_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PROD_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('CRITICAL: Supabase URL or Service Role Key missing for Admin Client.');
}

/**
 * ADMIN ONLY CLIENT
 * This client uses the Service Role Key, which BYPASSES Row Level Security.
 * Use this ONLY for operations that cannot be performed by the user's context,
 * such as generating signed upload URLs, managing system tables, or background jobs.
 */
export const supabaseAdmin = createClient(supabaseUrl || '', supabaseServiceKey || '');
