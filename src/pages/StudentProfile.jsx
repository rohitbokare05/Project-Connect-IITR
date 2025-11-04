
// export default StudentProfile;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import Navbar from '../components/Navbar';
import { User, Mail, Calendar, FileText, Upload, Download, ArrowLeft } from 'lucide-react';

const StudentProfile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists() && userDoc.data().role === 'student') {
        const data = userDoc.data();
        setProfileData(data);
        setName(data.name || '');
        setYear(data.year || '');
        setCustomMessage(data.customMessage || '');
        setResumeUrl(data.resumeUrl || '');
        setResumeName(data.resumeName || '');
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
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!year) {
      alert('Please select your year');
      return;
    }

    if (!customMessage.trim()) {
      alert('Please enter a custom message');
      return;
    }

    setSaving(true);
    let newResumeUrl = resumeUrl;
    let newResumeName = resumeName;

    try {
      // Upload resume if new file selected
      if (resumeFile) {
        setUploading(true);
        const timestamp = Date.now();
        const filename = `${timestamp}_${resumeFile.name}`;
        const storageRef = ref(storage, `resumes/${auth.currentUser.uid}/${filename}`);
        
        // Use uploadBytes instead of uploadBytesResumable to avoid CORS issues
        await uploadBytes(storageRef, resumeFile);
        newResumeUrl = await getDownloadURL(storageRef);
        newResumeName = resumeFile.name;
        setUploading(false);
      }

      // Update Firestore
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        name: name.trim(),
        year: year,
        customMessage: customMessage.trim(),
        resumeUrl: newResumeUrl,
        resumeName: newResumeName,
        updatedAt: new Date().toISOString()
      });

      alert('Profile updated successfully!');
      setResumeFile(null);
      loadProfile(); // Reload to show updated data

    } catch (error) {
      console.error('Save error:', error);
      if (error.code === 'storage/unauthorized') {
        alert('Upload failed: Please check Firebase Storage rules and make sure you are logged in.');
      } else {
        alert('Failed to save profile. Please try again.');
      }
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="student" />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="student" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center text-indigo-600 hover:text-indigo-700 mb-6 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Student Profile</h1>

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

          {/* Name Input */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <User className="h-4 w-4 mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
            />
            <p className="text-xs text-gray-500 mt-1">{name.length}/100 characters</p>
          </div>

          {/* Year Dropdown */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Academic Year *
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white transition-all duration-200"
            >
              <option value="">Select your year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="5th Year">5th Year</option>
            </select>
          </div>

          {/* Custom Message */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FileText className="h-4 w-4 mr-2" />
              About Me / Custom Message *
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              maxLength={500}
              rows={5}
              placeholder="Tell faculty members about yourself, your interests, and why you want to do research..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all duration-200"
            />
            <p className="text-xs text-gray-500 mt-1">{customMessage.length}/500 characters</p>
          </div>


          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;