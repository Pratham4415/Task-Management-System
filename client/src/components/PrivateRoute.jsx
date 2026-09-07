import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
