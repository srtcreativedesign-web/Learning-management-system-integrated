import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAuth, UserRole } from '../types/auth';
import { getApiUrl } from '../lib/api';

interface AuthContextType {
  user: UserAuth;
  role: UserRole;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const DEFAULT_USERS: Record<UserRole, UserAuth> = {
  SUPER_ADMIN: {
    id: 'usr-admin',
    name: 'Super Admin Pusat',
    email: 'admin@sobathr.com',
    role: 'SUPER_ADMIN',
    current_rank: 'Pakar SobatHR',
    total_xp: 2500,
  },
  HRBP_MANAGER: {
    id: 'usr-hrbp',
    name: 'Rina Agustina (HRBP)',
    email: 'manager.hrbp@sobathr.com',
    role: 'HRBP_MANAGER',
    current_rank: 'Master Pengetahuan',
    total_xp: 1800,
  },
  TRAINER: {
    id: 'usr-trainer',
    name: 'Budi Santoso (Trainer)',
    email: 'budi.trainer@sobathr.com',
    role: 'TRAINER',
    current_rank: 'Karyawan Terampil',
    total_xp: 650,
  },
  AUDITOR: {
    id: 'usr-auditor',
    name: 'Dian Pratama (Auditor)',
    email: 'dian.auditor@sobathr.com',
    role: 'AUDITOR',
    current_rank: 'Karyawan Terampil',
    total_xp: 450,
  },
};

export const DEFAULT_AUTH_CONTEXT_VALUE: AuthContextType = {
  user: DEFAULT_USERS.SUPER_ADMIN,
  role: 'SUPER_ADMIN',
  token: null,
  isLoading: false,
  login: async () => {},
  logout: () => {},
  switchRole: () => {},
};

const AuthContext = createContext<AuthContextType>(DEFAULT_AUTH_CONTEXT_VALUE);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAuth>(() => {
    const saved = localStorage.getItem('tnd_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_USERS.SUPER_ADMIN;
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('tnd_token'));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('tnd_user', JSON.stringify(user));
  }, [user]);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    // Map role based on email keyword
    let resolvedRole: UserRole = 'AUDITOR';
    if (cleanEmail.includes('admin') || cleanEmail.includes('super')) {
      resolvedRole = 'SUPER_ADMIN';
    } else if (cleanEmail.includes('manager') || cleanEmail.includes('hrbp')) {
      resolvedRole = 'HRBP_MANAGER';
    } else if (cleanEmail.includes('trainer')) {
      resolvedRole = 'TRAINER';
    }

    try {
      const res = await fetch(getApiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      const data = await res.json();
      if (data.access_token && data.user) {
        setToken(data.access_token);
        localStorage.setItem('tnd_token', data.access_token);
        const loggedUser: UserAuth = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: (data.user.role as UserRole) || resolvedRole,
          current_rank: data.user.current_rank,
          total_xp: data.user.total_xp,
        };
        setUser(loggedUser);
        return;
      }
    } catch {
      // Fallback local authenticated user for development
    } finally {
      setIsLoading(false);
    }

    // Default to mock role if backend is offline
    const fallbackUser = DEFAULT_USERS[resolvedRole] || {
      id: 'usr-custom',
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      role: resolvedRole,
    };
    setUser(fallbackUser);
  };

  const logout = () => {
    localStorage.removeItem('tnd_user');
    localStorage.removeItem('tnd_token');
    setUser(DEFAULT_USERS.SUPER_ADMIN);
    setToken(null);
  };

  const switchRole = (newRole: UserRole) => {
    const newUser = DEFAULT_USERS[newRole];
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        token,
        isLoading,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  return context || DEFAULT_AUTH_CONTEXT_VALUE;
}

