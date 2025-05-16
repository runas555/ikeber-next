import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Добавляем отдельную функцию для создания клиента
export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};
