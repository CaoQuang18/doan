import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaTrash, FaUserPlus, FaTimes } from 'react-icons/fa';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('Tất cả');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  // Load users từ API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError('Không thể tải danh sách users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Lọc theo role
  const filtered = filterRole === 'Tất cả' 
    ? users 
    : users.filter(u => u.role === filterRole.toLowerCase());

  // Toggle password visibility
  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Update user role
  const handleUpdateRole = async (userId, newRole) => {
    try {
      const user = users.find(u => u._id === userId);
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, role: newRole })
      });

      if (!res.ok) throw new Error('Cập nhật thất bại');

      setSuccess('Cập nhật role thành công!');
      setTimeout(() => setSuccess(''), 3000);
      fetchUsers();
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn xóa user này?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Xóa thất bại');

      setSuccess('Xóa user thành công!');
      setTimeout(() => setSuccess(''), 3000);
      fetchUsers();
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Thêm user thất bại');
      }

      setSuccess('Thêm user thành công!');
      setTimeout(() => setSuccess(''), 3000);
      setShowAddModal(false);
      setNewUser({ username: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Quản lý Users</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
        >
          <FaUserPlus /> Thêm User/Admin
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-400 rounded">
          {success}
        </div>
      )}

      {/* Nút lọc role */}
      <div className="mb-4">
        <label className="mr-2 font-medium text-gray-800 dark:text-gray-200">Lọc theo role:</label>
        <select
          className="border dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="Tất cả">Tất cả</option>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">Đang tải...</div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">STT</th>
                <th className="px-4 py-3 text-left">Username</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Password</th>
                <th className="px-4 py-3 text-center">Role</th>
                <th className="px-4 py-3 text-center">Ngày tạo</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filtered.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{user.username}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gray-900 dark:text-gray-100">
                        {visiblePasswords[user._id] ? user.password : '••••••••'}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(user._id)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        title={visiblePasswords[user._id] ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {visiblePasswords[user._id] ? (
                          <FaEyeSlash className="text-gray-600 dark:text-gray-400" />
                        ) : (
                          <FaEye className="text-gray-600 dark:text-gray-400" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs font-semibold border-0 cursor-pointer ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' 
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      }`}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                      title="Xóa user"
                    >
                      <FaTrash className="text-red-600 dark:text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal thêm user */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Thêm User/Admin</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Username</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded"
                >
                  Thêm
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 rounded"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
