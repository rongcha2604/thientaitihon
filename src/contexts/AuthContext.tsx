import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type User, type LoginCredentials, type RegisterData } from '../lib/api/auth.js';
import { STORAGE_KEYS } from '../lib/api/config.js';
import { mockAuthAPI } from '../lib/mock/auth.js';
import { clearAllExerciseProgress, clearAllProgressForUser } from '../lib/storage/exerciseProgress';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
          // Verify token is still valid and restore parentPin
          // refreshUser() sẽ gọi getMe() để restore parentPin từ mock users storage
          await refreshUser();
        } else {
          // TEMPORARY: Auto-create mock user for testing (no login required)
          // TODO: Remove this when authentication is re-enabled
          const mockUser: User = {
            id: 'test-user-' + Date.now(),
            email: 'test@test.com',
            fullName: 'Bé Test',
            grade: 1,
            role: 'user',
            createdAt: new Date().toISOString(),
            parentPin: '1234',
          };
          setUser(mockUser);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'mock-token-for-testing');
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'mock-refresh-token-for-testing');
          console.log('🔧 TEST MODE: Auto-login with mock user:', mockUser.email);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await mockAuthAPI.login(credentials);
      const { user, accessToken, refreshToken } = response;

      // Clear old progress data (from previous user or anonymous) - Chỉ clear data không có userId hoặc userId cũ
      // Giữ lại progress của user đang đăng nhập (nếu có)
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        // Clear old data: exercise_progress_${weekId}_... (không có userId) hoặc data của user khác
        if (key.startsWith('exercise_progress_') && !key.startsWith(`exercise_progress_${user.id}_`)) {
          localStorage.removeItem(key);
        }
        // Clear old selection: learning_selection (không có userId) hoặc selection của user khác
        if (key.startsWith('learning_selection') && key !== `learning_selection_${user.id}`) {
          localStorage.removeItem(key);
        }
      });

      // Store tokens and user
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      setUser(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await mockAuthAPI.register(data);
      const { user, accessToken, refreshToken } = response;

      // Log để debug parentPin
      if (user.parentPin) {
        console.log('✅ AuthContext.register(): User registered with parentPin:', user.email, 'PIN:', user.parentPin);
      } else {
        console.log('⚠️ AuthContext.register(): User registered without parentPin:', user.email);
      }

      // Clear old progress data (from previous user or anonymous)
      // Tài khoản mới → Bắt đầu từ đầu, không có data cũ
      clearAllExerciseProgress();

      // Clear old selection data (from previous user or anonymous)
      // Tài khoản mới → Không có selection cũ
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('learning_selection')) {
          localStorage.removeItem(key);
        }
      });

      // Store tokens and user (user object đã có parentPin từ mockAuthAPI.register)
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      // Verify parentPin trong stored user
      const storedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
      console.log('🔍 AuthContext.register(): Stored user object:', {
        email: storedUser.email,
        parentPin: storedUser.parentPin,
        hasParentPin: !!storedUser.parentPin,
      });
      
      if (storedUser.parentPin) {
        console.log('✅ AuthContext.register(): Verified parentPin in stored user:', storedUser.parentPin);
      } else {
        console.log('⚠️ AuthContext.register(): parentPin NOT found in stored user!');
        
        // Try to restore from mock users storage
        const { mockAuthAPI } = await import('../lib/mock/auth.js');
        try {
          const meResponse = await mockAuthAPI.getMe();
          console.log('🔍 AuthContext.register(): After getMe() call:', {
            email: meResponse.user.email,
            parentPin: meResponse.user.parentPin,
            hasParentPin: !!meResponse.user.parentPin,
          });
          if (meResponse.user.parentPin) {
            setUser(meResponse.user);
            console.log('✅ AuthContext.register(): Restored parentPin via getMe()');
          }
        } catch (error) {
          console.error('❌ AuthContext.register(): Error calling getMe():', error);
        }
      }

      setUser(user);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // KHÔNG clear progress data khi logout - Giữ lại để khi login lại vẫn có progress
      // Progress data đã được gắn với userId, nên sẽ không bị lẫn với user khác
      
      await mockAuthAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await mockAuthAPI.getMe();
      const { user } = response;

      // Update localStorage và state với user đã restore parentPin
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error('Refresh user error:', error);
      // Token might be invalid, logout
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

