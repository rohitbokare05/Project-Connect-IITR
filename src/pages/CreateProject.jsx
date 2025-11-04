import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import { ArrowLeft, FileText, Zap, Clock, DollarSign, Users, Calendar } from 'lucide-react';

const CreateProject = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [duration, setDuration] = useState('');
  const [stipend, setStipend] = useState('');
  const [positions, setPositions] = useState(1);
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Project title is required';
    } else if (title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }

    const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(s => s);
    if (skillsArray.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }

    if (!duration.trim()) {
      newErrors.duration = 'Duration is required';
    }

    if (!stipend.trim()) {
      newErrors.stipend = 'Stipend information is required';
    }

    if (!positions || positions < 1) {
      newErrors.positions = 'At least one position is required';
    }

    if (deadline) {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline must be a future date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Fetch faculty profile for denormalization
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const userData = userDoc.data();

      // Process skills
      const skillsArray = skillsInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      // Create project document
      await addDoc(collection(db, 'projects'), {
        facultyId: auth.currentUser.uid,
        facultyName: userData.facultyName || 'Faculty',
        facultyEmail: auth.currentUser.email,
        title: title.trim(),
        description: description.trim(),
        skillsRequired: skillsArray,
        duration: duration.trim(),
        stipend: stipend.trim(),
        positions: parseInt(positions),
        deadline: deadline || '',
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      alert('Project created successfully!');
      navigate('/faculty/dashboard');

    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="faculty" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/faculty/dashboard')}
          className="flex items-center text-indigo-600 hover:text-indigo-700 mb-6 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Research Project</h1>

          <form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Basic Information
              </h2>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                  placeholder="Enter a descriptive project title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">{title.length}/200 characters</p>
                  {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={2000}
                  rows={6}
                  placeholder="Describe the project, objectives, expected outcomes, and what students will learn..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all duration-200"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">{description.length}/2000 characters</p>
                  {errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
                </div>
              </div>
            </div>

            {/* Requirements Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Requirements
              </h2>

              {/* Skills */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Required Skills *
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="Python, Machine Learning, MATLAB, Signal Processing"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">Separate skills with commas</p>
                  {errors.skills && <p className="text-xs text-red-600">{errors.skills}</p>}
                </div>
              </div>
            </div>

            {/* Project Details Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Project Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Duration */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="h-4 w-4 mr-2" />
                    Duration *
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 3 months, 1 semester"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                  {errors.duration && <p className="text-xs text-red-600 mt-1">{errors.duration}</p>}
                </div>

                {/* Stipend */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Stipend *
                  </label>
                  <input
                    type="text"
                    value={stipend}
                    onChange={(e) => setStipend(e.target.value)}
                    placeholder="e.g., ₹5000/month or Unpaid"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                  {errors.stipend && <p className="text-xs text-red-600 mt-1">{errors.stipend}</p>}
                </div>

                {/* Positions */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Users className="h-4 w-4 mr-2" />
                    Number of Positions *
                  </label>
                  <input
                    type="number"
                    value={positions}
                    onChange={(e) => setPositions(e.target.value)}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                  {errors.positions && <p className="text-xs text-red-600 mt-1">{errors.positions}</p>}
                </div>

                {/* Deadline */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    Application Deadline (Optional)
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                  {errors.deadline && <p className="text-xs text-red-600 mt-1">{errors.deadline}</p>}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating...' : 'Create Project'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/faculty/dashboard')}
                disabled={submitting}
                className="px-6 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;