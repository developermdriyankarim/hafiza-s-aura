import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const rawKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Simple check to see if the URL is valid (starts with http/https)
// This prevents crashes if the environment variable is a placeholder string
const isValidUrl = (url: string) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

const sanitizeUrl = (url: string) => {
  if (!url) return '';
  let sanitized = url.trim();
  
  // If it's just the host (e.g. your-project.supabase.co)
  if (!sanitized.startsWith('http')) {
    sanitized = `https://${sanitized}`;
  }
  
  try {
    const urlObj = new URL(sanitized);
    return urlObj.origin; // This keeps only https://proj.supabase.co and removes any trailing paths or slashes
  } catch (e) {
    return sanitized.replace(/\/$/, '');
  }
};

const supabaseUrl = rawUrl && rawUrl !== '' && rawUrl !== 'your-project-url.supabase.co' 
  ? sanitizeUrl(rawUrl) 
  : 'https://qwuqjlbnxvcljmffpdin.supabase.co';

const supabaseAnonKey = rawKey && rawKey.trim() !== '' && rawKey.trim() !== 'your-anon-key'
  ? rawKey.trim() 
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3dXFqbGJueHZjbGptZmZwZGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MTc4NTQsImV4cCI6MjA5MzE5Mzg1NH0.fBmRD4hKE1Fcvk8xImZaS7h_MxqmGL8juIg0LQarptY';

if (!rawUrl || rawUrl === '') {
  console.warn('Supabase URL is missing. Using default fallback database.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
