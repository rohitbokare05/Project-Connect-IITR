import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import FacultyProjectCard from '../components/FacultyProjectCard';
import { PlusCircle } from 'lucide-react';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadUserData();
    loadProjects();
  }, []);

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setCurrentUser(userDoc.data());
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadProjects = async () => {
    try {
      // Remove orderBy to avoid needing a composite index
      const q = query(
        collection(db, 'projects'),
        where('facultyId', '==', auth.currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      const projectsList = querySnapshot.docs.map(doc => ({
        projectId: doc.id,
        ...doc.data()
      }));

      // Sort in JavaScript instead (newest first)
      projectsList.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA; // Descending order
      });

      setProjects(projectsList);
    } catch (error) {
      console.error('Error loading projects:', error);
      alert('Failed to load projects. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'projects', projectId));
      setProjects(projects.filter(p => p.projectId !== projectId));
      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const handleToggleStatus = async (projectId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'open' ? 'closed' : 'open';
      await updateDoc(doc(db, 'projects', projectId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      setProjects(projects.map(p =>
        p.projectId === projectId ? { ...p, status: newStatus } : p
      ));

      alert(`Project ${newStatus === 'open' ? 'opened' : 'closed'} successfully!`);
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update project status. Please try again.');
    }
  };

  const openProjects = projects.filter(p => p.status === 'open').length;
  const closedProjects = projects.filter(p => p.status === 'closed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="faculty" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {currentUser?.facultyName || 'Faculty'}
          </h1>
          <div className="flex items-center space-x-6 text-gray-600">
            <span>Total Projects: {projects.length}</span>
            <span className="text-green-600">Open: {openProjects}</span>
            <span className="text-gray-500">Closed: {closedProjects}</span>
          </div>
        </div>

        {/* Create Project Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/faculty/create-project')}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create New Project</span>
          </button>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg mb-4">You haven't created any projects yet.</p>
            <button
              onClick={() => navigate('/faculty/create-project')}
              className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Create Your First Project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map(project => (
              <FacultyProjectCard
                key={project.projectId}
                project={project}
                onDelete={handleDeleteProject}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;