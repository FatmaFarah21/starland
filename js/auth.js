// Frontend-only auth skeleton
// No actual authentication - frontend only

// Placeholder functions (no-ops for frontend skeleton)
export async function signIn(usernameOrEmail, password) {
    // Frontend only - no backend
    console.log('Frontend skeleton: signIn called', { usernameOrEmail });
    return { data: { user: { id: 'demo', email: usernameOrEmail } }, error: null };
}

export async function signOut() {
    // Frontend only - no backend
    console.log('Frontend skeleton: signOut called');
    return { error: null };
}

export async function getCurrentUser() {
    // Frontend only - no backend
    return { id: 'demo', email: 'user@example.com' };
}

export async function getCurrentRole() {
    // Frontend only - no backend
    return 'user';
}

// Auth guard middleware
export async function requireAuth() {
    // Frontend only - always allow
    return { id: 'demo', email: 'user@example.com' };
}
