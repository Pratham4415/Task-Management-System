import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        TaskFlow
      </Link>
      {user && (
        <div className="navbar-right">
          {isAdmin && (
            <div className="navbar-links">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>My Tasks</Link>
              <Link to="/admin/users" className={`nav-link ${location.pathname.startsWith('/admin/users') ? 'active' : ''}`}>Users</Link>
              <Link to="/admin/tasks" className={`nav-link ${location.pathname === '/admin/tasks' ? 'active' : ''}`}>All Tasks</Link>
            </div>
          )}
          <span className="navbar-user">
            {user.name}
            {isAdmin && <span className="admin-badge">Admin</span>}
          </span>
          <button onClick={handleLogout} className="btn btn-ghost">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
