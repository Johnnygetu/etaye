import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

export type Raffle = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  category: 'car' | 'house';
  ticket_price: number;
  max_numbers: number;
  status: 'open' | 'closed';
  end_date: string | null;
  draw_date: string | null;
  winner_name: string | null;
  winner_number: number | null;
  prize_value: string | null;
  specs: Record<string, string> | null;
  created_at: string;
};

export type Ticket = {
  id: string;
  raffle_id: string;
  number: number;
  buyer_name: string | null;
  buyer_email: string | null;
  purchased_at: string;
};
