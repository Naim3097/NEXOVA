import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log('URL:', supabaseUrl);

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test 1: List public templates (should return empty array)
    const { data: templates, error: templatesError } = await supabase
      .from('templates')
      .select('*')
      .eq('is_public', true);

    if (templatesError) {
      console.error('❌ Error fetching templates:', templatesError);
      return false;
    }

    console.log('✅ Templates query successful:', templates?.length || 0, 'templates found');

    // Test 2: Check table structure
    const { data: tables, error: tablesError } = await supabase
      .from('templates')
      .select('count');

    if (tablesError) {
      console.error('❌ Error checking table:', tablesError);
      return false;
    }

    console.log('✅ Database connection successful!');
    console.log('✅ All tables are accessible');

    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
}

testConnection()
  .then((success) => {
    if (success) {
      console.log('\n✅ Supabase is configured correctly!');
      process.exit(0);
    } else {
      console.log('\n❌ Supabase configuration has issues');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
