import { createClient } from '@supabase/supabase-js';

// Hardcoding these values bypasses the build-time environment variable issues.
// Replace these with your actual values from the Supabase dashboard.
const supabaseUrl = 'https://hutpmvjocklspplywxke.supabase.co';
const supabaseAnonKey = 'PASTE_YOUR_ACTUAL_LONG_ANON_KEY_HERE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
