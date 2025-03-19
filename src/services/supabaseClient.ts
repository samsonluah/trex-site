
import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Add detailed logging to debug environment variables
console.log('Environment variables check (supabaseClient.ts):');
console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Available' : 'Missing', typeof supabaseUrl === 'string' ? `(length: ${supabaseUrl.length})` : '');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Available' : 'Missing', typeof supabaseKey === 'string' ? `(length: ${supabaseKey.length})` : '');

// Check if Supabase credentials are available
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseKey;

console.log('Is Supabase fully configured:', isSupabaseConfigured);

// Create client only if credentials are available
let supabase = null;
if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client created successfully');
  } catch (error) {
    console.error('Error creating Supabase client:', error);
  }
}

// Force client rebuild and check for alternate ways to access environment variables
export const refreshSupabaseClient = () => {
  // Try direct window access if available (for deployed environments)
  const directUrl = (window as any)?._env?.VITE_SUPABASE_URL || supabaseUrl;
  const directKey = (window as any)?._env?.VITE_SUPABASE_ANON_KEY || supabaseKey;
  
  const hasDirectAccess = !!directUrl && !!directKey;
  
  if (hasDirectAccess) {
    console.log('Using direct environment variable access');
    supabase = createClient(directUrl, directKey);
    return true;
  } else if (isSupabaseConfigured && supabase) {
    console.log('Forcing Supabase client refresh with import.meta.env');
    supabase = createClient(supabaseUrl, supabaseKey);
    return true;
  }
  return false;
};

export { supabase };
