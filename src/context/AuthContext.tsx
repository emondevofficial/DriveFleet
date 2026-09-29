import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { db, verifyJWT, cookieStore } from '../services/db';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, photoURL?: string) => Promise<void>;
  googleLogin: (profile?: { name?: string; email?: string; photoURL?: string }) => Promise<void>;
  logout: () => void;
  updateUserContext: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore authenticated session on page reload (Critical rule: Logged in User must not be redirected to Login on reloading any private route)
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = cookieStore.getToken();
        const storedUserData = localStorage.getItem('drivefleet_current_user');

        if (storedToken) {
          const verified = verifyJWT(storedToken);
          if (verified) {
            setToken(storedToken);
            if (storedUserData) {
              setUser(JSON.parse(storedUserData));
            } else {
              // Reconstruct minimal user from verified JWT payload
              const restored: User = {
                _id: verified.userId,
                name: verified.name,
                email: verified.email,
                role: 'user',
                createdAt: new Date().toISOString()
              };
              setUser(restored);
              localStorage.setItem('drivefleet_current_user', JSON.stringify(restored));
            }
          } else {
            // Token expired or invalid
            cookieStore.removeToken();
            localStorage.removeItem('drivefleet_current_user');
          }
        }
      } catch (err) {
        console.error('Session restore error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await db.loginUser(email, pass);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('drivefleet_current_user', JSON.stringify(res.user));
  };

  const register = async (name: string, email: string, pass: string, photoURL?: string) => {
    await db.registerUser({ name, email, password: pass, photoURL });
  };

  const googleLogin = async (profile?: { name?: string; email?: string; photoURL?: string }) => {
    const res = await db.googleLogin(profile);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('drivefleet_current_user', JSON.stringify(res.user));
  };

  const logout = () => {
    cookieStore.removeToken();
    localStorage.removeItem('drivefleet_current_user');
    setUser(null);
    setToken(null);
  };

  const updateUserContext = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('drivefleet_current_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        googleLogin,
        logout,
        updateUserContext
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
