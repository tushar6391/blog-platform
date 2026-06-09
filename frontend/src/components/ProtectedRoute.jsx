import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While we're checking localStorage, don't redirect yet
  if (loading) {
    return (
      <div className="text-center py-20 text-stone-500 italic font-serif">
        Loading...
      </div>
    );
  }

  if (!user) {
    // Send them to login, remember where they wanted to go
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default ProtectedRoute;