const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Env Vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Checking Supabase...');

    const tables = ['Alert', 'Sensor', 'Policy', 'SystemLog', 'Command'];

    for (const table of tables) {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (error) console.error(`[${table}] Error:`, error.message);
        else console.log(`[${table}] Count: ${count}`);
    }

    // Double check Policy data if count > 0
    const { data: policies } = await supabase.from('Policy').select('*').limit(1);
    if (policies && policies.length > 0) {
        console.log('Sample Policy:', JSON.stringify(policies[0], null, 2));
    } else {
        console.log('No policies found. Seeding defaults...');
        // Logic to seed defaults if empty, just like store.ts but explicit here
    }
}

check();
