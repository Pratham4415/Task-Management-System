import { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksRes, usersRes] = await Promise.all([
          api.get('/admin/tasks'),
          api.get('/admin/users')
        ]);
        setTasks(tasksRes.data);
        setUsers(usersRes.data);
      } catch {
        setToast('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const filtered = useMemo(() => {
    let result = tasks;
    if (selectedUser !== 'all') {
      result = result.filter(t => t.userId?._id === selectedUser);
    }
    if (selectedStatus !== 'all') {
      result = result.filter(t => t.status === selectedStatus);
    }
    return result;
  }, [tasks, selectedUser, selectedStatus]);

  const counts = useMemo(() => ({
    total: filtered.length,
    pending: filtered.filter(t => t.status === 'pending').length,
    'in-progress': filtered.filter(t => t.status === 'in-progress').length,
    done: filtered.filter(t => t.status === 'done').length
  }), [filtered]);

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const statusClass = { 'pending': 'status-pending', 'in-progress': 'status-progress', 'done': 'status-done' };
  const statusLabel = { 'pending': 'Pending', 'in-progress': 'In Progress', 'done': 'Done' };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="dashboard-header">
          <div>
            <h1>All Tasks</h1>
            <p className="subtitle">{counts.total} tasks — {counts.pending} pending, {counts['in-progress']} in progress, {counts.done} done</p>
          </div>
        </div>

        <div className="admin-filters">
          <div className="form-group">
            <label htmlFor="userFilter">Filter by User</label>
            <select id="userFilter" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
              <option value="all">All Users</option>
              {users.filter(u => u.role !== 'admin').map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="statusFilter">Filter by Status</label>
            <select id="statusFilter" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loader-container"><div className="loader"></div></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
            <h3>No tasks found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(task => (
                  <tr key={task._id}>
                    <td>
                      <div className="td-name">{task.title}</div>
                      {task.description && <div className="td-desc">{task.description}</div>}
                    </td>
                    <td className="td-muted">{task.userId?.name || 'Unknown'}</td>
                    <td>
                      <span className={`status-badge ${statusClass[task.status]}`}>
                        {statusLabel[task.status]}
                      </span>
                    </td>
                    <td className={`td-muted ${new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'overdue-text' : ''}`}>
                      {formatDate(task.dueDate)}
                    </td>
                    <td className="td-muted">{formatDate(task.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

export default AdminTasks;
