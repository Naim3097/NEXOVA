# Database Migration Instructions

## Subdomain Support Migration

**Migration File:** `supabase/migrations/20260106110000_add_subdomain_support.sql`

### How to Apply

Since we're working with a remote Supabase instance, you have two options to apply this migration:

#### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard SQL Editor:
   https://supabase.com/dashboard/project/kppnhfjwkzdrmoqwdhbi/sql/new

2. Copy the contents of `supabase/migrations/20260106110000_add_subdomain_support.sql`

3. Paste into the SQL editor

4. Click "Run" to execute the migration

5. Verify the migration was successful by checking:
   - The `profiles` table has a new `subdomain` column
   - The constraint on `subscription_plan` only allows 'free' and 'pro'
   - The functions `generate_subdomain()`, `ensure_unique_subdomain()`, and `auto_generate_subdomain()` exist

#### Option 2: Supabase CLI (When Docker is Available)

If you have Docker running, you can use the Supabase CLI:

```bash
# Link your project (one-time setup)
supabase link --project-ref kppnhfjwkzdrmoqwdhbi

# Apply all pending migrations
supabase db push

# Or apply just this migration
supabase db push --include-all
```

### What This Migration Does

1. **Adds `subdomain` column to `profiles` table**
   - Unique text field for Pro users
   - Example: "johndoe" for johndoe.yourdomain.com

2. **Updates subscription plan constraint**
   - Changes from 4-tier (free/starter/pro/agency) to 2-tier (free/pro)

3. **Creates helper functions**
   - `generate_subdomain(name)`: Generates URL-friendly subdomain from display name
   - `ensure_unique_subdomain(base)`: Ensures subdomain uniqueness by adding counter if needed
   - `auto_generate_subdomain()`: Trigger function to auto-generate subdomains for Pro users

4. **Adds `custom_domain` column to `projects` table**
   - For future custom domain support

### Verification Queries

After applying the migration, run these queries to verify:

```sql
-- Check subdomain column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'subdomain';

-- Check subscription_plan constraint
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'profiles_subscription_plan_check';

-- Check functions exist
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name IN ('generate_subdomain', 'ensure_unique_subdomain', 'auto_generate_subdomain');

-- Check trigger exists
SELECT trigger_name, event_manipulation
FROM information_schema.triggers
WHERE trigger_name = 'trigger_auto_generate_subdomain';
```

### Rollback

If you need to rollback this migration:

```sql
-- Drop trigger and functions
DROP TRIGGER IF EXISTS trigger_auto_generate_subdomain ON profiles;
DROP FUNCTION IF EXISTS auto_generate_subdomain();
DROP FUNCTION IF EXISTS ensure_unique_subdomain(TEXT);
DROP FUNCTION IF EXISTS generate_subdomain(TEXT);

-- Remove columns
ALTER TABLE profiles DROP COLUMN IF EXISTS subdomain;
ALTER TABLE projects DROP COLUMN IF EXISTS custom_domain;

-- Restore old constraint (if needed)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_subscription_plan_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_plan_check
  CHECK (subscription_plan IN ('free', 'starter', 'pro', 'agency'));
```

### Testing the Migration

After applying, test the subdomain auto-generation:

```sql
-- Update a user to Pro plan (trigger should generate subdomain)
UPDATE profiles
SET subscription_plan = 'pro'
WHERE id = 'your-user-id';

-- Check if subdomain was generated
SELECT id, display_name, subdomain, subscription_plan
FROM profiles
WHERE id = 'your-user-id';
```
