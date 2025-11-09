import React, { useState, useEffect } from 'react';
import { adminAPI, type AnalyticsDashboard, type User } from '../../lib/api/admin.js';
import { STORAGE_KEYS } from '../../lib/api/config.js';

interface AdminDashboardProps {
  onExit: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Check if admin is already logged in
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      // Try to verify token by fetching data
      loadDashboard();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminAPI.login({ email, password });
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      setIsLoggedIn(true);
      await loadDashboard();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async () => {
    setLoadingData(true);
    try {
      const [analyticsData, usersData] = await Promise.all([
        adminAPI.getAnalyticsDashboard(7),
        adminAPI.getUsers({ page: 1, limit: 10 }),
      ]);
      setAnalytics(analyticsData);
      setUsers(usersData.users);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setIsLoggedIn(false);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    setIsLoggedIn(false);
    setAnalytics(null);
    setUsers([]);
  };

  // Show login form if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF5] p-4">
        <div className="bg-white/80 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20 p-8 max-w-md w-full">
          <h1 className="text-3xl font-black text-amber-900 text-center mb-6">
            🔧 Admin Login
          </h1>
          
          {error && (
            <div className="bg-red-100 border-2 border-red-300 text-red-800 rounded-2xl p-4 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="admin@example.com"
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
              className="w-full bg-blue-500 text-white font-black py-4 rounded-3xl text-xl shadow-viet-style-raised hover:scale-105 active:scale-95 active:shadow-viet-style-pressed transition-all border-2 border-blue-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập Admin'}
            </button>
          </form>

          <button
            onClick={onExit}
            className="w-full mt-4 bg-gray-300 text-gray-800 font-bold py-3 rounded-2xl hover:bg-gray-400 transition-all"
          >
            Quay lại App
          </button>
        </div>
      </div>
    );
  }

  // Show dashboard
  return (
    <div className="min-h-screen bg-[#FDFBF5] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20 p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black text-amber-900">🔧 Admin Dashboard</h1>
            <div className="flex gap-4">
              <button
                onClick={loadDashboard}
                disabled={loadingData}
                className="bg-blue-500 text-white px-6 py-2 rounded-2xl font-bold hover:bg-blue-600 transition-all disabled:opacity-50"
              >
                {loadingData ? 'Đang tải...' : '🔄 Làm mới'}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-2xl font-bold hover:bg-red-600 transition-all"
              >
                Đăng xuất
              </button>
              <button
                onClick={onExit}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-2xl font-bold hover:bg-gray-400 transition-all"
              >
                Quay lại App
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20 p-6">
              <div className="text-2xl font-black text-amber-900">👥 Tổng Users</div>
              <div className="text-4xl font-black text-blue-600 mt-2">{analytics.totalUsers}</div>
            </div>
            <div className="bg-white/80 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20 p-6">
              <div className="text-2xl font-black text-amber-900">🔥 Active Users</div>
              <div className="text-4xl font-black text-green-600 mt-2">{analytics.activeUsers}</div>
              <div className="text-sm text-gray-600 mt-1">({analytics.period})</div>
            </div>
            <div className="bg-white/80 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20 p-6">
              <div className="text-2xl font-black text-amber-900">📚 Bài đã làm</div>
              <div className="text-4xl font-black text-purple-600 mt-2">{analytics.totalExercises}</div>
            </div>
            <div className="bg-white/80 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20 p-6">
              <div className="text-2xl font-black text-amber-900">📊 Top Subjects</div>
              <div className="text-lg font-bold text-amber-800 mt-2">
                {analytics.topSubjects.length > 0 ? analytics.topSubjects[0].subject : 'N/A'}
              </div>
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="bg-white/80 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20 p-6">
          <h2 className="text-2xl font-black text-amber-900 mb-4">👥 Danh sách Users</h2>
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-amber-300">
                    <th className="text-left p-3 font-bold text-amber-800">Email</th>
                    <th className="text-left p-3 font-bold text-amber-800">Tên</th>
                    <th className="text-left p-3 font-bold text-amber-800">Lớp</th>
                    <th className="text-left p-3 font-bold text-amber-800">Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-amber-200">
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.fullName || '-'}</td>
                      <td className="p-3">{user.grade ? `Lớp ${user.grade}` : '-'}</td>
                      <td className="p-3">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">Chưa có users</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

