// Supabase Configuration
// Get these values from your Supabase project settings:
// https://app.supabase.com/project/[YOUR-PROJECT-ID]/settings/api

const SUPABASE_CONFIG = {
    // Replace with your actual Supabase URL
    // Format: https://[project-id].supabase.co
    URL: 'https://cqqhrwyovjjmapzxpddo.supabase.co',
    
    // Replace with your actual Supabase anon key
    // Go to Settings > API > Project API keys > anon key
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxcWhyd3lvdmpqbWFwenhwZGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNjU2ODMsImV4cCI6MjA4NTY0MTY4M30.8pLh4uIAVKfndRRkSD9Jaw188-QvLBLfuRHGVJzz3F4'
};

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);

// Export for use in other modules
window.supabaseClient = supabaseClient;
window.supabase = supabase;
