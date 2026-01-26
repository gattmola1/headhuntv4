import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('--- Connection Test ---');
console.log('URL:', url);
console.log('Key Length:', key ? key.length : 0);

if (!url || !key) {
    console.error('ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(url, key, {
    auth: {
        persistSession: false
    }
});

async function testTable(tableName) {
    console.log(`\nTesting table: '${tableName}'...`);
    const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error(`❌ Error accessing '${tableName}':`, JSON.stringify(error, null, 2));
        console.error(`   Hint: Does the table exist? is it named correctly?`);
    } else {
        console.log(`✅ Success! Found ${count} rows in '${tableName}'.`);
    }
}

async function main() {
    await testTable('postings');
    await testTable('applications');
    await testTable('collaborators');
    await testTable('ideas');
    await testTable('prospects');

    // Check if maybe 'jobs' exists instead of 'postings'?
    await testTable('jobs');
}

main();
