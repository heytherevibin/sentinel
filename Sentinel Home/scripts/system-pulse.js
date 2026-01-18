const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read .env manually
const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length === 2) env[parts[0].trim()] = parts[1].trim().replace(/"/g, '');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function runPulseCheck() {
    console.log('--- SENTINEL SYSTEM PULSE CHECK ---');

    const results = {
        db_connection: 'INIT',
        tables: {}
    };

    try {
        // 1. Check Tables Existence & RLS
        const tables = ['Alert', 'Sensor', 'Policy', 'SystemLog', 'Command', 'SystemConfig'];
        for (const table of tables) {
            const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
            if (error) {
                console.error(`[${table}] ❌ Error: ${error.message}`);
                results.tables[table] = 'FAILED';
            } else {
                console.log(`[${table}] ✅ OK (Count: ${count})`);
                results.tables[table] = 'OK';
            }
        }

        // 2. Test Write Persistence
        console.log('\n--- TESTING WRITE PERSISTENCE ---');
        const testLog = { type: 'VERIFY', component: 'PULSE_CHECK', message: 'System integrity pulse at ' + new Date().toISOString() };
        const { data: logData, error: logError } = await supabase.from('SystemLog').insert(testLog).select();

        if (logError) {
            console.error('[SystemLog] ❌ Write Failed:', logError.message);
        } else {
            console.log('[SystemLog] ✅ Write-Verify Succeeded. ID:', logData[0].id);
        }

        // 3. Test Config Engine
        console.log('\n--- TESTING CONFIG ENGINE ---');
        const testConfig = { key: 'pulse_active', value: 'true' };
        const { error: cfgError } = await supabase.from('SystemConfig').upsert(testConfig);
        if (cfgError) console.error('[SystemConfig] ❌ Upsert Failed:', cfgError.message);
        else console.log('[SystemConfig] ✅ Upsert-Verify Succeeded.');

        console.log('\n--- PULSE COMPLETE ---');
    } catch (e) {
        console.error('Pulse check crashed:', e);
    }
}

runPulseCheck();
