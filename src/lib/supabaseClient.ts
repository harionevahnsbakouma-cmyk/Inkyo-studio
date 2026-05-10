import { createClient } from '@supabase/supabase-js';

// On utilise les variables d'environnement de Vite pour la sécurité
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Attention : Les variables d'environnement Supabase sont manquantes !");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);