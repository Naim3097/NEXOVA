#!/usr/bin/env node
// Script to reset templates and create Ebook template
// Run with: node scripts/apply-migration.js

console.log('\n╔══════════════════════════════════════════════════════════╗');
console.log('║     TEMPLATE RESET - EBOOK SALES PAGE MIGRATION        ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

console.log('📋 This script will:');
console.log('   1. Delete all existing templates');
console.log('   2. Create new "Ebook Sales Page" template');
console.log('   3. Add 11 pre-configured elements\n');

console.log('⚠️  MANUAL STEPS REQUIRED:\n');
console.log('Please apply the migration manually via Supabase Dashboard:\n');
console.log('1. Go to: https://supabase.com/dashboard/project/kppnhfjwkzdrmoqwdhbi');
console.log('2. Navigate to: SQL Editor (left sidebar)');
console.log('3. Click: "New Query"');
console.log('4. Copy the migration file content:');
console.log('   📁 supabase/migrations/20260109030000_reset_templates_ebook.sql');
console.log('5. Paste into SQL editor and click "Run"\n');

console.log('✨ After running the migration, your template gallery will have:');
console.log('   ✅ 1 Ebook category');
console.log('   ✅ "Ebook Sales Page" template');
console.log('   ✅ 11 elements configured (announcement bar, nav, hero, etc.)\n');

console.log('═══════════════════════════════════════════════════════════\n');

process.exit(0);
