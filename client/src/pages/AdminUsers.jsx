import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import UserModal from '../components/UserModal';
import ConfirmDialog from '../components/ConfirmDialog';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch {
      setToast('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleCreate = () => { setEditUser(null); setModalOpen(true); };
  const handleEdit = (user) => { setEditUser(user); setModalOpen(true); };

  const handleSubmit = async (form) => {
    setSaving(true);
    try {
      if (editUser) {
        const { data } = await api.put(`/admin/users/${editUser._id}`, form);
        setUsers(users.map(u => u._id === data._id ? data : u));
        setToast('User updated');
      } else {
        const { data } = await api.post('/admin/users', form);
        setUsers([data, ...users]);
        setToast('User created');
      }
      setModalOpen(false);
    } catch (err) {
      setToast(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/users/${deleteTarget._id}`);
      setUsers(users.filter(u => u._id !== deleteTarget._id));
      setToast('User deleted');
    } catch (err) {
      setToast(err.response?.data?.message || 'Delete failed');
    }
    setDeleteTarget(null);
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="dashboard-header">
          <div>
            <h1>User Management</h1>
            <p className="subtitle">{users.length} users</p>
          </div>
          <button className="btn btn-primary" onClick={handleCreate}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add User
          </button>
        </div>

        {loading ? (
          <div className="loader-container"><div className="loader"></div></div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td className="td-name">{u.name}</td>
                    <td className="td-muted">{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="td-muted">{formatDate(u.createdAt)}</td>
                    <td>
                      <div className="table-actions">
                        <button className="icon-btn" onClick={() => handleEdit(u)} title="Edit">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        {u.role !== 'admin' && (
                          <button className="icon-btn delete" onClick={() => setDeleteTarget(u)} title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <UserModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} user={editUser} loading={saving} />
      <ConfirmDialog isOpen={!!deleteTarget} message={`Delete "${deleteTarget?.name}"? All their tasks will also be deleted.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

export default AdminUsers;
