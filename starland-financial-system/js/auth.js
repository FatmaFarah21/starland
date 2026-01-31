import { supabase } from './config.js';

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return data.user;
}

export async function requireAuth() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    window.location.href = '../index.html';
    return null;
  }
  return data.user;
}

export async function getCurrentRole() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('roles:role_id(role_name)')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile || !profile.roles) {
    return null;
  }

  return profile.roles.role_name;
}
