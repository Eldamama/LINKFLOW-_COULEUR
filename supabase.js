import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = "https://xkyynzbbatglctgdtqyu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_pcrDzFZ9rkilVIw12_0uvw_2CcdtvLB";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
