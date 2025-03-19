
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*
Row Level Security Setup Instructions:

To fix the "new row violates row-level security policy" error:

1. Go to your Supabase dashboard -> Authentication -> Policies
2. For the "orders" table, create a new policy:
   - Policy name: "Enable inserts for authenticated users" 
   - Target roles: Leave blank to apply to all roles
   - Using expression: true
   - With check expression: true

This allows any user (including anonymous) to insert data into the orders table.
For a production app, you might want to set up more restrictive policies.
*/
