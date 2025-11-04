import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import { User, Mail, Building2, Briefcase, MapPin, Phone, ArrowLeft, Edit2, Save, X } from 'lucide-react';

const FacultyProfile = () => {
  const navigate = useNavigate();
  const [facultyName, setFacultyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [officeLocation, setOfficeLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists() && userDoc.data().role === 'faculty') {
        const data = userDoc.data();
        setProfileData(data);
        setFacultyName(data.facultyName || '');
        setDesignation(data.designation || '');
        setOfficeLocation(data.officeLocation || '');
        setPhone(data.phone || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Failed to load profile. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!facultyName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!designation) {
      alert('Please select your designation');
      return;
    }

    setSaving(true);

    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        facultyName: facultyName.trim(),
        designation: designation,
        officeLocation: officeLocation.trim(),
        phone: phone.trim(),
        updatedAt: new Date().toISOString()
      });

      alert('Profile updated successfully!');
      setIsEditing(false);
      loadProfile(); // Reload to show updated data

    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setFacultyName(profileData?.facultyName || '');
    setDesignation(profileData?.designation || '');
    setOfficeLocation(profileData?.officeLocation || '');
    setPhone(profileData?.phone || '');
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="faculty" />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="faculty" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/faculty/dashboard')}
          className="flex items-center text-indigo-600 hover:text-indigo-700 mb-6 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Faculty Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <Edit2 className="h-5 w-5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          {/* Email Display */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Mail className="h-4 w-4 mr-2" />
              Email Address
            </label>
            <input
              type="email"
              value={profileData?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Department Display */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Building2 className="h-4 w-4 mr-2" />
              Department
            </label>
            <input
              type="text"
              value="ECE (Electronics and Communication Engineering)"
              disabled
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Faculty Name */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <User className="h-4 w-4 mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your full name"
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-all duration-200 ${
                isEditing
                  ? 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  : 'bg-gray-50 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Designation */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Briefcase className="h-4 w-4 mr-2" />
              Designation *
            </label>
            <select
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-all duration-200 ${
                isEditing
                  ? 'bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  : 'bg-gray-50 cursor-not-allowed'
              }`}
            >
              <option value="">Select designation</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
            </select>
          </div>

          {/* Office Location */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              Office Location
            </label>
            <input
              type="text"
              value={officeLocation}
              onChange={(e) => setOfficeLocation(e.target.value)}
              disabled={!isEditing}
              placeholder="e.g., Room 301, ECE Building"
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-all duration-200 ${
                isEditing
                  ? 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  : 'bg-gray-50 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Phone */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Phone className="h-4 w-4 mr-2" />
              Contact Number (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!isEditing}
              placeholder="Enter contact number"
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-all duration-200 ${
                isEditing
                  ? 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  : 'bg-gray-50 cursor-not-allowed'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;