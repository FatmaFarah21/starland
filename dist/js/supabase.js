// Supabase Client Setup
// This file initializes the Supabase client with the project URL and anonymous key
// In a real application, these values should be stored securely

const SUPABASE_URL = 'https://uqqxcuqflasmdjcbhnwb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxcXhjdXFmbGFzbWRqY2JobndiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMDIyODksImV4cCI6MjA4NDU3ODI4OX0.D6QgE6BZHG-sCe0B9u96oeMlnRDXvKQck0AAT4csLS4';

// Wait for Supabase to load, then initialize client
let supabaseClient;

if (window.supabase && typeof window.supabase.createClient === 'function') {
  const { createClient } = window.supabase;
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.error('Supabase library not loaded. Please check that the Supabase CDN script is included before this script.');
  supabaseClient = null;
}

// Export the supabase client for use in other files
window.supabaseClient = supabaseClient;

// Check if user is authenticated
async function isAuthenticated() {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return false;
  }
  const { data: { session }, error } = await supabaseClient.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error.message);
    return false;
  }
  
  return session !== null;
}

// Get current user
async function getCurrentUser() {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return null;
  }
  const { data: { session }, error } = await supabaseClient.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error.message);
    return null;
  }
  
  return session?.user || null;
}

// Get user role from user metadata or app metadata
async function getUserRole() {
  const user = await getCurrentUser();
  if (!user) return null;
  
  // Check for role in user's user_metadata or app_metadata
  let role = user.user_metadata?.role || user.app_metadata?.role;
  
  // If no role found in metadata, determine based on email pattern
  if (!role) {
    if (user.email?.includes('admin')) return 'admin';
    if (user.email?.includes('manager') || user.email?.includes('management')) return 'management';
    return 'entry';
  }
  
  return role;
}

// Get current user's display name
async function getCurrentUserDisplayName() {
  const user = await getCurrentUser();
  if (!user) return 'Unknown User';
  
  // Try to get name from metadata first
  const displayName = user.user_metadata?.full_name || 
                    user.user_metadata?.name || 
                    user.app_metadata?.full_name ||
                    user.email;
  
  return displayName || 'Unknown User';
}

// Get current user's email
async function getCurrentUserEmail() {
  const user = await getCurrentUser();
  if (!user) return 'unknown@system.com';
  
  return user.email || 'unknown@system.com';
}

// Sign out user
async function signOut() {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return false;
  }
  const { error } = await supabaseClient.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error.message);
    return false;
  }
  
  return true;
}

// Sign up function
async function signUp(email, password, userData = {}) {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  
  if (error) {
    console.error('Sign up error:', error.message);
    return { data: null, error };
  }
  
  return { data, error };
}

// Sign in with email and password
async function signInWithEmail(email, password) {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.error('Sign in error:', error.message);
    return { data: null, error };
  }
  
  return { data, error };
}

// Listen for auth state changes
function onAuthStateChange(callback) {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return null;
  }
  const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  
  return subscription;
}

// Get Supabase configuration info
function getSupabaseConfig() {
  return {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY
  };
}

// Instructions for setting up Supabase authentication
function getSetupInstructions() {
  return `To use this application with Supabase authentication:

1. Go to your Supabase dashboard at https://app.supabase.com
2. Select your project
3. Go to Authentication > Settings
4. Make sure the following settings are configured:
   - Enable Email Signups
   - Set your site URL to: ${window.location.origin}
   - Add redirect URLs as needed
   - For development, you may want to disable "Enable email confirmations"
     or manually confirm new user emails in the Auth > Users section

5. If keeping email confirmation enabled:
   - After registering, check the Auth > Users section in your Supabase dashboard
   - Manually confirm new user emails for immediate access

6. For role-based access:
   - You can assign roles via the Supabase dashboard in Auth > Users
   - Or update the user metadata with a "role" field`;
}

// Test Supabase connection
async function testConnection() {
  try {
    if (!supabaseClient) {
      console.error('Supabase client not initialized');
      return { success: false, error: { message: 'Supabase client not initialized' } };
    }
    // Try to ping the auth endpoint
    const { data: { user } } = await supabaseClient.auth.getUser();
    console.log('Supabase connection test result:', user ? 'Connected with user' : 'Connected - no user');
    return { success: true, user: user };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { success: false, error: error };
  }
}

// Export functions for use in other files
window.supabaseAuth = {
  isAuthenticated,
  getCurrentUser,
  getUserRole,
  getCurrentUserDisplayName,
  getCurrentUserEmail,
  signOut,
  signUp,
  signInWithEmail,
  onAuthStateChange,
  getSupabaseConfig,
  getSetupInstructions,
  testConnection
};