# Supabase Setup Guide

To ensure your application works correctly with Supabase, follow these steps:

## 1. Environment Variables
Ensure you have set the following secrets in your project settings:
- `VITE_SUPABASE_URL`: Your Supabase Project URL (e.g., `https://xyz.supabase.co`)
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key

## 2. SQL Setup
You **MUST** run the SQL commands in `SUPABASE_SETUP.sql` in your Supabase SQL Editor. This will:
- Create the `profiles` table.
- Set up a **Trigger** to automatically create a profile when a new user signs up.
- Create tables for `products`, `orders`, and more.
- Enable **Realtime** so your dashboard updates automatically.
- Configure **Row Level Security (RLS)** so users can only see their own data.

## 3. Deployment
After running the SQL, your registration and login will sync perfectly with the "Users" list in Supabase Auth and the "profiles" table in your Database.

---
*Note: If you see "Invalid path" error, double check that your Supabase URL does not end with a slash or have extra paths.*
