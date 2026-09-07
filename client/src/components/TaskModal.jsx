import { useState, useEffect } from 'react';

const TaskModal = ({ isOpen, onClose, onSubmit, task, loading }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    dueDate: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
      });
    } else {
      setForm({ title: '', description: '', status: 'pending', dueDate: '' });
    }
    setError('');
  }, [task, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getLocalToday = () => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
    return new Date(Date.now() - tzoffset).toISOString().split('T')[0];
  };
  const today = getLocalToday();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required');
    if (!form.dueDate) return setError('Due date is required');
    if (form.dueDate < today) return setError('Due date cannot be in the past');
    setError('');
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Task title" maxLength={100} />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Task description (optional)" rows={3} maxLength={500} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input id="dueDate" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} min={today} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
