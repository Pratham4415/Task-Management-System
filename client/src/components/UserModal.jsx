import { useState, useEffect } from 'react';

const UserModal = ({ isOpen, onClose, onSubmit, user, loading }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, password: '' });
    } else {
      setForm({ name: '', email: '', password: '' });
    }
    setError('');
  }, [user, isOpen]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required');
    if (!form.email.trim()) return setError('Email is required');
    if (!user && !form.password) return setError('Password is required');
    if (!user && form.password.length < 6) return setError('Password must be at least 6 characters');
    setError('');

    const payload = { name: form.name, email: form.email };
    if (!user) payload.password = form.password;
    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{user ? 'Edit User' : 'Create User'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="user@example.com" />
          </div>
          {!user && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" />
            </div>
          )}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Saving...' : (user ? 'Update User' : 'Create User')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
