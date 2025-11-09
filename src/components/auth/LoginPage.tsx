import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // Login form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register form states
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState<number | ''>('');
  const [parentPin, setParentPin] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Normalize email: trim whitespace and convert to lowercase
      const normalizedEmail = email.trim().toLowerCase();
      
      // Validate email format
      if (!normalizedEmail || !normalizedEmail.includes('@')) {
        setError('Vui lòng nhập email hợp lệ');
        setLoading(false);
        return;
      }

      // Debug: Log login attempt
      console.log('🔍 LoginPage.handleLoginSubmit(): Login attempt:', {
        originalEmail: email,
        normalizedEmail: normalizedEmail,
        hasPassword: !!password,
        passwordLength: password?.length || 0,
      });

      await login({ email: normalizedEmail, password });
      // Redirect will be handled by App.tsx
    } catch (err: any) {
      // Handle both API errors and mock errors
      const errorMessage = err.response?.data?.error || err.message || 'Đăng nhập thất bại';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (registerPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (registerPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (parentPin && parentPin.length !== 4) {
      setError('Mã PIN phụ huynh phải có 4 số');
      return;
    }

    setLoading(true);

    // Debug: Log data trước khi gọi register
    console.log('🔍 LoginPage.handleRegisterSubmit(): Data to register:', {
      email: registerEmail,
      parentPin: parentPin,
      parentPinType: typeof parentPin,
      parentPinLength: parentPin?.length,
      parentPinOrUndefined: parentPin || undefined,
      hasParentPin: !!parentPin,
    });

    try {
      const registerData = {
        email: registerEmail,
        password: registerPassword,
        fullName: fullName || undefined,
        grade: grade ? Number(grade) : undefined,
        parentPin: parentPin || undefined,
      };
      
      console.log('🔍 LoginPage.handleRegisterSubmit(): Calling register with:', {
        ...registerData,
        parentPin: registerData.parentPin,
        parentPinType: typeof registerData.parentPin,
      });
      
      await register(registerData);
      // Redirect will be handled by App.tsx (register auto-login)
    } catch (err: any) {
      // Handle both API errors and mock errors
      const errorMessage = err.response?.data?.error || err.message || 'Đăng ký thất bại';
      // Translate common errors
      if (errorMessage.includes('already registered') || errorMessage.includes('đã được đăng ký')) {
        setError('Email này đã được đăng ký');
      } else if (errorMessage.includes('Validation error')) {
        setError('Vui lòng kiểm tra lại thông tin đã nhập');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
    // Clear form when switching
    setEmail('');
    setPassword('');
    setRegisterEmail('');
    setRegisterPassword('');
    setConfirmPassword('');
    setFullName('');
    setGrade('');
    setParentPin('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF5] p-4">
      <div className="bg-white/80 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20 p-8 max-w-md w-full">
        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => !isRegisterMode || switchMode()}
            className={`flex-1 py-3 rounded-2xl font-black text-lg transition-all ${
              !isRegisterMode
                ? 'bg-red-400 text-white shadow-viet-style-raised border-2 border-red-500/50'
                : 'bg-amber-100 text-amber-800 border-2 border-amber-300 hover:bg-amber-200'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => isRegisterMode || switchMode()}
            className={`flex-1 py-3 rounded-2xl font-black text-lg transition-all ${
              isRegisterMode
                ? 'bg-red-400 text-white shadow-viet-style-raised border-2 border-red-500/50'
                : 'bg-amber-100 text-amber-800 border-2 border-amber-300 hover:bg-amber-200'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        <h1 className="text-3xl font-black text-amber-900 text-center mb-6">
          {isRegisterMode ? '👨‍👩‍👧‍👦 Đăng Ký Cho Bé' : '🏫 Đăng Nhập'}
        </h1>
        
        {error && (
          <div className="bg-red-100 border-2 border-red-300 text-red-800 rounded-2xl p-4 mb-4">
            {error}
          </div>
        )}

        {!isRegisterMode ? (
          // Login Form
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-amber-800 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-amber-300 focus:border-amber-500 focus:outline-none text-lg"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-amber-800 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-amber-300 focus:border-amber-500 focus:outline-none text-lg"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-400 text-white font-black py-4 rounded-3xl text-xl shadow-viet-style-raised hover:scale-105 active:scale-95 active:shadow-viet-style-pressed transition-all border-2 border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
          </form>
        ) : (
          // Register Form
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-amber-800 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-amber-300 focus:border-amber-500 focus:outline-none text-lg"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-amber-800 mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-2xl border-2 border-amber-300 focus:border-amber-500 focus:outline-none text-lg"
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-amber-800 mb-2">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-2xl border-2 focus:outline-none text-lg ${
                  confirmPassword && registerPassword !== confirmPassword
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-amber-300 focus:border-amber-500'
                }`}
                placeholder="Nhập lại mật khẩu"
              />
              {confirmPassword && registerPassword !== confirmPassword && (
                <p className="text-red-500 text-sm mt-1">Mật khẩu không khớp</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-amber-800 mb-2">
                Tên phụ huynh / Tên bé
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-amber-300 focus:border-amber-500 focus:outline-none text-lg"
                placeholder="Tên phụ huynh hoặc tên bé"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-amber-800 mb-2">
                Lớp học
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-3 rounded-2xl border-2 border-amber-300 focus:border-amber-500 focus:outline-none text-lg bg-white"
              >
                <option value="">Chọn lớp (không bắt buộc)</option>
                <option value={1}>Lớp 1</option>
                <option value={2}>Lớp 2</option>
                <option value={3}>Lớp 3</option>
                <option value={4}>Lớp 4</option>
                <option value={5}>Lớp 5</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-amber-800 mb-2">
                Mã PIN phụ huynh (4 số)
              </label>
              <input
                type="text"
                value={parentPin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setParentPin(value);
                }}
                className="w-full px-4 py-3 rounded-2xl border-2 border-amber-300 focus:border-amber-500 focus:outline-none text-lg"
                placeholder="0000 (không bắt buộc)"
                maxLength={4}
              />
              <p className="text-sm text-amber-600 mt-1">
                Mã PIN để phụ huynh truy cập khu vực phụ huynh
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-400 text-white font-black py-4 rounded-3xl text-xl shadow-viet-style-raised hover:scale-105 active:scale-95 active:shadow-viet-style-pressed transition-all border-2 border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

