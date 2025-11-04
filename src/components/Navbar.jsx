import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { BookOpen, User, PlusCircle, LogOut, Briefcase } from 'lucide-react';

const Navbar = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await signOut(auth);
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
        alert('Failed to logout. Please try again.');
      }
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">
              ECE Research Connect
            </span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-2">
            {userRole === 'student' && (
              <>
                <button
                  onClick={() => navigate('/student/dashboard')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isActive('/student/dashboard')
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Briefcase className="h-5 w-5" />
                  <span className="hidden sm:inline">Browse Projects</span>
                </button>
                <button
                  onClick={() => navigate('/student/profile')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isActive('/student/profile')
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">My Profile</span>
                </button>
              </>
            )}

            {userRole === 'faculty' && (
              <>
                <button
                  onClick={() => navigate('/faculty/dashboard')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isActive('/faculty/dashboard')
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Briefcase className="h-5 w-5" />
                  <span className="hidden sm:inline">My Projects</span>
                </button>
                <button
                  onClick={() => navigate('/faculty/create-project')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isActive('/faculty/create-project')
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <PlusCircle className="h-5 w-5" />
                  <span className="hidden sm:inline">Create Project</span>
                </button>
                <button
                  onClick={() => navigate('/faculty/profile')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isActive('/faculty/profile')
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">My Profile</span>
                </button>
              </>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;