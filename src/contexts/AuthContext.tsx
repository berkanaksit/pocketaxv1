import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, checkIsAdmin } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { isTestingBypassEnabled } from '../lib/testing';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  profile: Database['public']['Tables']['users_profile']['Row'] | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  profile: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<Database['public']['Tables']['users_profile']['Row'] | null>(null);
  const [initialized, setInitialized] = useState(false);

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

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          const adminStatus = await checkIsAdmin(session.user.id);
          setIsAdmin(adminStatus);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setInitialized(true);
          setLoading(false);
        }
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);
        const adminStatus = await checkIsAdmin(session.user.id);
        setIsAdmin(adminStatus);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setIsAdmin(false);
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading: loading && !initialized, isAdmin, profile }}>
      {children}
    </AuthContext.Provider>
  );
};