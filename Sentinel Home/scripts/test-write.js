const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read .env manually to be safe
const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length === 2) env[parts[0].trim()] = parts[1].trim().replace(/"/g, '');
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testWrite() {
    console.log('Testing Write to SystemLog...');
    const { data, error } = await supabase.from('SystemLog').insert({
        type: 'DEBUG',
        component: 'DIAGNOSTIC_SCRIPT',
        message: 'Manual write test at ' + new Date().toISOString()
    }).select();

    if (error) {
        console.error('Write Failed:', error);
    } else {
        console.log('Write Succeeded:', data);
        const { count } = await supabase.from('SystemLog').select('*', { count: 'exact', head: true });
        console.log('New Count:', count);
    }
}

testWrite();
