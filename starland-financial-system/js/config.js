import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Replace with your NEW Supabase project credentials
// Example: https://your-project-id.supabase.co
export const SUPABASE_URL = 'https://qdgnhvjorckugqcxnzbx.supabase.co';

// Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZ25odmpvcmNrdWdxY3huemJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NzgyNzcsImV4cCI6MjA4NTQ1NDI3N30.WarFp_quHK8sGYgUMRoU8NDt-it16DdT7sn_7D4p0b8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
