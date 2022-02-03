import { createClient } from "@supabase/supabase-js";

const SUPA_BASE_URL = process.env.NEXT_PUBLIC_SUPA_BASE_URL;
const SUPA_BASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPA_BASE_ANON_KEY;
export const supaBaseClient = createClient(SUPA_BASE_URL, SUPA_BASE_ANON_KEY);
