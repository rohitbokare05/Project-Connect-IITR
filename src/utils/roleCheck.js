// Role validation utilities

export const isStudent = (userRole) => {
  return userRole === 'student';
};

export const isFaculty = (userRole) => {
  return userRole === 'faculty';
};

export const getRoleDashboard = (userRole) => {
  if (userRole === 'student') return '/student/dashboard';
  if (userRole === 'faculty') return '/faculty/dashboard';
  return '/';
};

export const validateRoleAccess = (userRole, requiredRole) => {
  if (!requiredRole) return true; // Public route
  return userRole === requiredRole;
};