import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('Applying subdomain support migration...\n');

  const migrationPath = path.join(__dirname, '../supabase/migrations/20260106110000_add_subdomain_support.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  // Split by semicolon but be careful with function bodies
  const statements = sql
    .split(/;(?=\s*(?:--|$|\n\s*(?:ALTER|CREATE|COMMENT)))/gm)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Found ${statements.length} SQL statements to execute\n`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';
    console.log(`\nExecuting statement ${i + 1}/${statements.length}...`);
    console.log(statement.substring(0, 100) + '...\n');

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement });

      if (error) {
        console.error(`❌ Error executing statement ${i + 1}:`, error.message);

        // Continue with other statements even if one fails
        continue;
      }

      console.log(`✅ Statement ${i + 1} executed successfully`);
    } catch (err) {
      console.error(`❌ Exception executing statement ${i + 1}:`, err);
    }
  }

  console.log('\n\n=== Migration Complete ===');
  console.log('\nNote: If you see errors about missing exec_sql function,');
  console.log('you\'ll need to apply this migration manually through the Supabase dashboard:');
  console.log('https://supabase.com/dashboard/project/kppnhfjwkzdrmoqwdhbi/sql/new');
}

applyMigration()
  .then(() => {
    console.log('\n✅ Migration script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
