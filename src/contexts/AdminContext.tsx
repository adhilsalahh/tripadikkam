import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, Admin } from '../lib/supabase';

interface AdminContextType {
  admin: Admin | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, whatsapp?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkFirstTimeSetup: () => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: adminData } = await supabase
          .from('admins')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setAdmin(adminData);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkFirstTimeSetup = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .limit(1);
      
      if (error) throw error;
      return data.length === 0;
    } catch (error) {
      console.error('Error checking setup:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, whatsapp?: string) => {
    try {
      // First check if this is the first admin
      const isFirstTime = await checkFirstTimeSetup();
      if (!isFirstTime) {
        return { success: false, error: 'Admin already exists' };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { error: insertError } = await supabase
          .from('admins')
          .insert([{
            id: data.user.id,
            email,
            whatsapp,
          }]);

        if (insertError) throw insertError;

        const { data: adminData } = await supabase
          .from('admins')
          .select('*')
          .eq('id', data.user.id)
          .single();

        setAdmin(adminData);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: adminData } = await supabase
          .from('admins')
          .select('*')
          .eq('id', data.user.id)
          .single();

        setAdmin(adminData);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{
      admin,
      isLoading,
      login,
      signup,
      logout,
      checkFirstTimeSetup,
    }}>
      {children}
    </AdminContext.Provider>
  );
};