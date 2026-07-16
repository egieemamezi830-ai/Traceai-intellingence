import { createClient } from '@supabase/supabase-js';

// Hardcoded values bypass the build-time environment variable issues
const supabaseUrl = 'https://hutpmvjocklspplywxke.supabase.co';
const supabaseAnonKey = 'PASTE_YOUR_ACTUAL_eyJ_KEY_HERE'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
