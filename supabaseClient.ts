
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tckfpafzxjqinhndjrxw.supabase.co';
const supabaseAnonKey = 'sb_publishable_kCaWNwcXbM0vqgAXrCgVbQ_xxMo4npn';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
