import { createClient } from '@supabase/supabase-js';

// Hardcoding these values to bypass build-time environment variable issues
const supabaseUrl = 'https://hutpmvjocklspplywxke.supabase.co';
const supabaseAnonKey = 'PASTE_YOUR_LONG_eyJ_KEY_HERE'; // <--- PUT YOUR ACTUAL KEY HERE

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
