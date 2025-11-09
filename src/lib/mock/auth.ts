// Mock Auth Service - No Backend Required
// This service simulates backend authentication using localStorage

import type { LoginCredentials, RegisterData, User, AuthResponse } from '../api/auth.js';
import { STORAGE_KEYS } from '../api/config.js';

// Mock users storage key
const MOCK_USERS_KEY = 'mock_users';

// Generate fake JWT token
function generateFakeToken(): string {
  return `mock_jwt_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
}

// Get mock users from localStorage
function getMockUsers(): Map<string, { password: string; parentPin?: string; user: User }> {
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Handle both array format (from Map.entries()) and object format
      if (Array.isArray(parsed)) {
        return new Map(parsed);
      } else {
        // Convert object to Map if needed
        return new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.error('Error parsing mock users:', error);
      return new Map();
    }
  }
  return new Map();
}

// Save mock users to localStorage
function saveMockUsers(users: Map<string, { password: string; parentPin?: string; user: User }>): void {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(Array.from(users.entries())));
}

// Mock Auth API
export const mockAuthAPI = {
  async register(data: RegisterData): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Debug: Log data nhận được
    console.log('🔍 register(): Received data:', {
      email: data.email,
      parentPin: data.parentPin,
      parentPinType: typeof data.parentPin,
      parentPinLength: data.parentPin?.length,
      hasParentPin: !!data.parentPin,
      parentPinTrimmed: data.parentPin?.trim(),
    });

    const users = getMockUsers();

    // Check if email already exists
    if (users.has(data.email)) {
      throw new Error('Email này đã được đăng ký');
    }

    // Create mock user
    // QUAN TRỌNG: parentPin phải được lưu vào User object ngay từ đầu
    // Nếu data.parentPin là empty string, vẫn lưu (không convert thành undefined)
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      email: data.email,
      fullName: data.fullName,
      grade: data.grade,
      avatarUrl: null,
      role: 'student',
      createdAt: new Date().toISOString(),
      // Lưu parentPin vào User object (không convert empty string thành undefined)
      parentPin: data.parentPin && data.parentPin.trim().length > 0 ? data.parentPin : undefined,
    };
    
    console.log('🔍 register(): Creating user object:', {
      email: user.email,
      parentPin: user.parentPin,
      dataParentPin: data.parentPin,
      hasParentPin: !!user.parentPin,
    });

    // Save user with password and PIN (in real app, password and PIN would be hashed)
    // QUAN TRỌNG: parentPin phải được lưu vào cả User object VÀ mock users storage
    // Debug: Check parentPin trước khi lưu
    console.log('🔍 register(): Before storing parentPin:', {
      dataParentPin: data.parentPin,
      dataParentPinType: typeof data.parentPin,
      dataParentPinLength: data.parentPin?.length,
      dataParentPinTrimmed: data.parentPin?.trim(),
      dataParentPinTrimmedLength: data.parentPin?.trim().length,
    });
    
    // Lưu parentPin nếu có (không convert empty string thành undefined quá sớm)
    // Nếu data.parentPin là empty string "", vẫn lưu (không convert thành undefined)
    // Chỉ convert thành undefined nếu data.parentPin là undefined, null, hoặc empty string sau khi trim
    const parentPinToStore = data.parentPin && typeof data.parentPin === 'string' && data.parentPin.trim().length > 0 
      ? data.parentPin.trim() 
      : undefined;
    
    console.log('🔍 register(): parentPinToStore:', {
      parentPinToStore,
      parentPinToStoreType: typeof parentPinToStore,
      parentPinToStoreLength: parentPinToStore?.length,
      hasParentPinToStore: !!parentPinToStore,
    });
    users.set(data.email, {
      password: data.password, // In real app, this would be hashed
      parentPin: parentPinToStore, // Lưu PIN để verify sau
      user: {
        ...user,
        parentPin: parentPinToStore, // Đảm bảo User object cũng có parentPin
      },
    });
    saveMockUsers(users);
    
    // Log để debug - Verify saved data
    const savedUserData = users.get(data.email);
    console.log('🔍 register(): Saved userData:', {
      email: data.email,
      parentPin: savedUserData?.parentPin,
      userParentPin: savedUserData?.user?.parentPin,
      hasParentPin: !!savedUserData?.parentPin,
    });
    
    // Verify sau khi save
    const verifyUsers = getMockUsers();
    const verifyUserData = verifyUsers.get(data.email);
    if (verifyUserData?.parentPin) {
      console.log('✅ register(): Verified parentPin in mock users storage:', verifyUserData.parentPin);
    } else {
      console.log('❌ register(): parentPin NOT found in mock users storage after save!');
    }
    
    // Log để debug
    if (data.parentPin) {
      console.log('✅ register(): Saved parentPin for user:', data.email, 'PIN:', data.parentPin);
    } else {
      console.log('⚠️ register(): No parentPin provided for user:', data.email);
    }

    // Generate fake tokens
    const accessToken = generateFakeToken();
    const refreshToken = generateFakeToken();

    // Final verification: Đảm bảo user object có parentPin đúng
    // QUAN TRỌNG: parentPin phải được lưu vào User object khi return
    const finalUser = {
      ...user,
      parentPin: parentPinToStore, // Đảm bảo parentPin được lưu đúng
    };
    
    console.log('🔍 register(): Returning user object:', {
      email: finalUser.email,
      parentPin: finalUser.parentPin,
      hasParentPin: !!finalUser.parentPin,
      parentPinToStore: parentPinToStore,
    });
    
    return {
      user: finalUser,
      accessToken,
      refreshToken,
    };
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Normalize email: trim whitespace and convert to lowercase
    const normalizedEmail = credentials.email.trim().toLowerCase();
    
    // Debug: Log login attempt
    console.log('🔍 login(): Login attempt:', {
      originalEmail: credentials.email,
      normalizedEmail: normalizedEmail,
      emailLength: credentials.email.length,
      normalizedEmailLength: normalizedEmail.length,
      hasPassword: !!credentials.password,
      passwordLength: credentials.password?.length || 0,
    });

    const users = getMockUsers();
    
    // Debug: Log all registered emails
    const registeredEmails = Array.from(users.keys());
    console.log('🔍 login(): Registered emails:', registeredEmails);
    console.log('🔍 login(): Total registered users:', registeredEmails.length);
    
    const userData = users.get(normalizedEmail);

    // Check if user exists
    if (!userData) {
      console.log('❌ login(): User not found:', normalizedEmail);
      throw new Error('Email này chưa được đăng ký. Vui lòng đăng ký tài khoản mới.');
    }

    // Check if password matches
    const passwordMatches = userData.password === credentials.password;
    console.log('🔍 login(): Password check:', {
      email: normalizedEmail,
      passwordMatches: passwordMatches,
      storedPasswordLength: userData.password?.length || 0,
      providedPasswordLength: credentials.password?.length || 0,
    });

    if (!passwordMatches) {
      console.log('❌ login(): Password incorrect for user:', normalizedEmail);
      throw new Error('Mật khẩu không đúng. Vui lòng kiểm tra lại.');
    }

    // Restore parentPin from stored user data (nếu user chưa có parentPin)
    if (userData.parentPin && (!userData.user.parentPin || userData.user.parentPin === undefined || userData.user.parentPin === null || userData.user.parentPin === '')) {
      userData.user.parentPin = userData.parentPin;
      console.log('✅ login(): Restored parentPin from stored user data:', credentials.email, userData.user.parentPin);
    } else if (userData.user.parentPin) {
      console.log('✅ login(): User already has parentPin:', credentials.email, userData.user.parentPin);
    } else {
      console.log('⚠️ login(): No parentPin found for user:', credentials.email);
    }

    // Generate fake tokens
    const accessToken = generateFakeToken();
    const refreshToken = generateFakeToken();

    return {
      user: userData.user,
      accessToken,
      refreshToken,
    };
  },

  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    // No-op in mock mode
  },

  async getMe(): Promise<{ user: User }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Get user from localStorage
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (!storedUser) {
      throw new Error('User not found');
    }

    const user = JSON.parse(storedUser) as User;
    
    console.log('🔍 getMe(): User from localStorage:', {
      email: user.email,
      parentPin: user.parentPin,
      hasParentPin: !!user.parentPin,
    });
    
    // Restore parentPin from mock users storage (nếu user chưa có parentPin hoặc undefined)
    // Check: !user.parentPin (undefined, null, empty string) hoặc user.parentPin không có trong stored data
    if ((!user.parentPin || user.parentPin === undefined || user.parentPin === null || user.parentPin === '') && user.email) {
      const users = getMockUsers();
      const userData = users.get(user.email);
      
      console.log('🔍 getMe(): Checking mock users storage:', {
        email: user.email,
        userDataExists: !!userData,
        userDataParentPin: userData?.parentPin,
        userDataUserParentPin: userData?.user?.parentPin,
      });
      
      if (userData?.parentPin) {
        user.parentPin = userData.parentPin;
        // Update localStorage với parentPin mới
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        console.log('✅ getMe(): Restored parentPin from mock users storage:', user.email, user.parentPin);
      } else {
        console.log('⚠️ getMe(): No parentPin found in mock users storage for:', user.email);
        console.log('🔍 getMe(): All mock users:', Array.from(users.keys()));
      }
    } else {
      console.log('✅ getMe(): User already has parentPin:', user.email, user.parentPin);
    }
    
    // Final verification
    console.log('🔍 getMe(): Final user object:', {
      email: user.email,
      parentPin: user.parentPin,
      hasParentPin: !!user.parentPin,
    });
    
    return { user };
  },

  async updateProfile(data: { fullName?: string; grade?: number }): Promise<{ user: User }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    // Get user from localStorage
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (!storedUser) {
      throw new Error('User not found');
    }

    const user = JSON.parse(storedUser) as User;

    // Get parentPin from mock users storage first (to preserve it)
    const users = getMockUsers();
    const userData = users.get(user.email);
    
    // Update user data (preserve parentPin)
    const updatedUser: User = {
      ...user,
      ...(data.fullName !== undefined && { fullName: data.fullName }),
      ...(data.grade !== undefined && { grade: data.grade }),
      // Preserve parentPin from stored data if user doesn't have it
      parentPin: user.parentPin || userData?.parentPin,
    };

    // Update in mock users storage
    if (userData) {
      users.set(user.email, {
        ...userData,
        user: updatedUser,
        parentPin: updatedUser.parentPin || userData.parentPin,
      });
      saveMockUsers(users);
    }

    // Update in localStorage với parentPin
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

    return { user: updatedUser };
  },
};

