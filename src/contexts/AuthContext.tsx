import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, checkIsAdmin } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { isTestingBypassEnabled, validateBypassCode } from '../lib/testing';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  profile: Database['public']['Tables']['users_profile']['Row'] | null;
  bypassLogin: (code: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  profile: null,
  bypassLogin: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<Database['public']['Tables']['users_profile']['Row'] | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [bypassActive, setBypassActive] = useState(false);
  
  // Check if bypass was previously active
  React.useEffect(() => {
    const wasActive = localStorage.getItem('bypass_active') === 'true';
    if (wasActive && isTestingBypassEnabled()) {
      setBypassActive(true);
    }
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('users_profile')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!error && data) {
      setProfile(data);
    } else {
      // Create profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from('users_profile')
        .insert([{ user_id: userId }])
        .select()
        .single();

      if (!createError && newProfile) {
        setProfile(newProfile);
      } else {
        console.error('Error creating user profile:', createError);
        setProfile(null);
      }
    }
  };

  const bypassLogin = async (code: string): Promise<boolean> => {
    if (validateBypassCode(code)) {
      setLoading(false);
      setBypassActive(true);
      setUser({ id: 'bypass-user', email: 'bypass@test.com' } as User);
      setIsAdmin(true);
      setProfile({
        id: 'bypass-profile',
        user_id: 'bypass-user',
        full_name: 'Test User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      localStorage.setItem('bypass_active', 'true');
      return true;
    }
    return false;
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;

      if (currentUser) {
        setUser(currentUser);
        const adminStatus = await checkIsAdmin(currentUser.id);
        setIsAdmin(adminStatus);
        await fetchProfile(currentUser.id);
      } else if (!bypassActive || !isTestingBypassEnabled()) {
        setUser(null);
        setIsAdmin(false);
        setProfile(null);
        localStorage.removeItem('bypass_active');
      }
    });

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;

      if (currentUser) {
        setUser(currentUser);
        const adminStatus = await checkIsAdmin(currentUser.id);
        setIsAdmin(adminStatus);
        await fetchProfile(currentUser.id);
      } else if (!bypassActive || !isTestingBypassEnabled()) {
        setUser(null);
        setIsAdmin(false);
        setProfile(null);
        localStorage.removeItem('bypass_active');
      }
      setSessionChecked(true);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading: loading && !sessionChecked, isAdmin, profile, bypassLogin }}>
      {children}
    </AuthContext.Provider>
  );
};