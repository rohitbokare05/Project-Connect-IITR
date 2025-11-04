import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { BookOpen, Mail, Lock, UserCircle, GraduationCap } from 'lucide-react';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegistration = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password || !confirmPassword || !role) {
      setError('Please fill in all fields');
      return;
    }

    // Check email domain
    if (!email.endsWith('@iitr.ac.in')) {
      setError('Please use your IIT Roorkee email (@iitr.ac.in)');
      return;
    }

    // Check password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Check passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      const userData = {
        uid: user.uid,
        email: user.email,
        role: role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add role-specific fields
      if (role === 'student') {
        userData.name = '';
        userData.year = '';
        userData.customMessage = '';
        userData.resumeUrl = '';
        userData.resumeName = '';
      } else {
        userData.facultyName = '';
        userData.department = 'ECE';
        userData.designation = '';
        userData.officeLocation = '';
        userData.phone = '';
      }

      await setDoc(doc(db, 'users', user.uid), userData);

      alert('Registration successful! Welcome to ECE Research Connect.');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Account already exists. Please login.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email format');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // App.jsx will handle redirect based on role
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email format');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-16 w-16 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ECE Research Connect</h1>
          <p className="text-gray-600">IIT Roorkee</p>
        </div>

        {/* Login/Register Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>

          {/* Role Selection (Registration Only) */}
          {isRegistering && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${
                    role === 'student'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <GraduationCap className={`h-8 w-8 mb-2 ${role === 'student' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className={`font-semibold ${role === 'student' ? 'text-indigo-600' : 'text-gray-600'}`}>
                    Student
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('faculty')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${
                    role === 'faculty'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <UserCircle className={`h-8 w-8 mb-2 ${role === 'faculty' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className={`font-semibold ${role === 'faculty' ? 'text-indigo-600' : 'text-gray-600'}`}>
                    Faculty
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={isRegistering ? handleRegistration : handleLogin}>
            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@iitr.ac.in"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Confirm Password (Registration Only) */}
            {isRegistering && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isRegistering ? 'Register' : 'Login')}
            </button>
          </form>

          {/* Toggle Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="mb-2">🎯 Connect with faculty for research opportunities</p>
          <p>🔬 Browse and apply for exciting projects</p>
        </div>
      </div>
    </div>
  );
};

export default Login;