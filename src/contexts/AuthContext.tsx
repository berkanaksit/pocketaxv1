import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, checkIsAdmin } from '../lib/supabase';
import { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  profile: Database['public']['Tables']['users_profile']['Row'] | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  profile: null,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<Database['public']['Tables']['users_profile']['Row'] | null>(null);

  const clearAuthState = () => {
    setUser(null);
    setIsAdmin(false);
    setProfile(null);
  };

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

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      clearAuthState();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        console.log('AuthContext: Initializing...');
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log('AuthContext: Session check result:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id
        });
        
        if (!mounted) return;
        
        if (!session?.user) {
          console.log('AuthContext: No session found');
          clearAuthState();
          setLoading(false);
          return;
        }
        
        console.log('AuthContext: Setting user and fetching profile');
        setUser(session.user);
        await fetchProfile(session.user.id);
        const adminStatus = await checkIsAdmin(session.user.id);
        setIsAdmin(adminStatus);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthState();
        setLoading(false);
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext: Auth state changed:', event, {
        hasSession: !!session,
        hasUser: !!session?.user
      });
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session?.user) {
        console.log('AuthContext: User signed out or no session');
        clearAuthState();
        setLoading(false);
        return;
      }

      console.log('AuthContext: User signed in, updating state');
      setUser(session.user);
      await fetchProfile(session.user.id);
      const adminStatus = await checkIsAdmin(session.user.id);
      setIsAdmin(adminStatus);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, profile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};