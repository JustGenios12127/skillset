import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sncuudtddldhenzqdsle.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuY3V1ZHRkZGxkaGVuenFkc2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMTg2MDQsImV4cCI6MjA4NzU5NDYwNH0.15NEUrWVRivtG-BYvmpEWDhAdLRH0h40Jbu0kc0lPgk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
