import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, user, userRole, requiredRole }) => {
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check if user has the required role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    const redirectPath = userRole === 'student' 
      ? '/student/dashboard' 
      : '/faculty/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has correct role
  return children;
};

export default ProtectedRoute;