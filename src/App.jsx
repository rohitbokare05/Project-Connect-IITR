import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import FacultyDashboard from './pages/FacultyDashboard';
import FacultyProfile from './pages/FacultyProfile';
import CreateProject from './pages/CreateProject';

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Fetch user document to get role
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUser(currentUser);
            setUserRole(userDoc.data().role);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to={userRole === 'student' ? '/student/dashboard' : '/faculty/dashboard'} replace />
            ) : (
              <Login />
            )
          } 
        />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute user={user} userRole={userRole} requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute user={user} userRole={userRole} requiredRole="student">
              <StudentProfile />
            </ProtectedRoute>
          }
        />

        {/* Faculty Routes */}
        <Route
          path="/faculty/dashboard"
          element={
            <ProtectedRoute user={user} userRole={userRole} requiredRole="faculty">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/profile"
          element={
            <ProtectedRoute user={user} userRole={userRole} requiredRole="faculty">
              <FacultyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/create-project"
          element={
            <ProtectedRoute user={user} userRole={userRole} requiredRole="faculty">
              <CreateProject />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to appropriate dashboard */}
        <Route
          path="*"
          element={
            <Navigate 
              to={
                user 
                  ? (userRole === 'student' ? '/student/dashboard' : '/faculty/dashboard')
                  : '/'
              } 
              replace 
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;