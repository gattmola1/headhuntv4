import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.PROD_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_PROD_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PROD_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing.');
}

// Basic JWT validation to catch common typos
if (supabaseKey && !supabaseKey.startsWith('eyJ')) {
    console.warn('Warning: SUPABASE_SERVICE_ROLE_KEY does not appear to be a valid JWT (should start with "eyJ"). Check for typos.');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
