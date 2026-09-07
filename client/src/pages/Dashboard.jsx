import { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import FilterBar from '../components/FilterBar';
import ConfirmDialog from '../components/ConfirmDialog';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const counts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length
  }), [tasks]);

  const filtered = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter(t => t.status === filter);
  }, [tasks, filter]);

  const handleCreate = () => { setEditTask(null); setModalOpen(true); };

  const handleEdit = (task) => { setEditTask(task); setModalOpen(true); };

  const handleSubmit = async (form) => {
    setSaving(true);
    try {
      if (editTask) {
        const { data } = await api.put(`/tasks/${editTask._id}`, form);
        setTasks(tasks.map(t => t._id === data._id ? data : t));
        setToast('Task updated');
      } else {
        const { data } = await api.post('/tasks', form);
        setTasks([data, ...tasks]);
        setToast('Task created');
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
      await api.delete(`/tasks/${deleteTarget._id}`);
      setTasks(tasks.filter(t => t._id !== deleteTarget._id));
      setToast('Task deleted');
    } catch {
      setToast('Delete failed');
    }
    setDeleteTarget(null);
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="dashboard-header">
          <div>
            <h1>My Tasks</h1>
            <p className="subtitle">{counts.all} total, {counts.done} completed</p>
          </div>
          <button className="btn btn-primary" onClick={handleCreate}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Task
          </button>
        </div>

        <FilterBar current={filter} onChange={setFilter} counts={counts} />

        {error && <div className="form-error">{error}</div>}

        {loading ? (
          <div className="loader-container"><div className="loader"></div></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
            </svg>
            <h3>No tasks {filter !== 'all' ? `with "${filter}" status` : 'yet'}</h3>
            <p>Click "Add Task" to create your first task</p>
          </div>
        ) : (
          <div className="task-grid">
            {filtered.map(task => (
              <TaskCard key={task._id} task={task} onEdit={handleEdit} onDelete={setDeleteTarget} />
            ))}
          </div>
        )}
      </main>

      <TaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} task={editTask} loading={saving} />
      <ConfirmDialog isOpen={!!deleteTarget} message={`Delete "${deleteTarget?.title}"? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

export default Dashboard;
