import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const rawKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Simple check to see if the URL is valid (starts with http/https)
// This prevents crashes if the environment variable is a placeholder string
const isValidUrl = (url: string) => {
  try {
    return url && (url.startsWith('https://') || url.startsWith('http://'));
  } catch (e) {
    return false;
  }
};

const supabaseUrl = isValidUrl(rawUrl) ? rawUrl : 'https://qwuqjlbnxvcljmffpdin.supabase.co';
const supabaseAnonKey = rawKey && rawKey !== '' ? rawKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3dXFqbGJueHZjbGptZmZwZGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MTc4NTQsImV4cCI6MjA5MzE5Mzg1NH0.fBmRD4hKE1Fcvk8xImZaS7h_MxqmGL8juIg0LQarptY';

if (!isValidUrl(rawUrl)) {
  console.warn('Supabase URL is missing or invalid. Using default fallback database.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
