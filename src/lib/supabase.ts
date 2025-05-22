import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

export async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Unexpected error checking admin status:', error);
    return false;
  }
  
  return data !== null;
}

export async function addAdminUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // First check if the user exists in auth.users table
    const { data: userData, error: userError } = await supabase
      .auth.admin.getUserById(userId);

    if (userError || !userData?.user) {
      return { 
        success: false, 
        error: 'User not found' 
      };
    }

    // Check if user is already an admin
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (existingAdmin) {
      return { 
        success: false, 
        error: 'User is already an admin' 
      };
    }

    // Add user to admin_users table
    const { error: insertError } = await supabase
      .from('admin_users')
      .insert([{ id: userId }]);

    if (insertError) {
      console.error('Error adding admin user:', insertError);
      return { 
        success: false, 
        error: 'Failed to add admin user' 
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in addAdminUser:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred' 
    };
  }
}