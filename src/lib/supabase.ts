import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://qwuqjlbnxvcljmffpdin.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3dXFqbGJueHZjbGptZmZwZGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MTc4NTQsImV4cCI6MjA5MzE5Mzg1NH0.fBmRD4hKE1Fcvk8xImZaS7h_MxqmGL8juIg0LQarptY';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration is missing. Please check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
