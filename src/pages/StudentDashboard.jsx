import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import { Search, Filter } from 'lucide-react';

const StudentDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('All Skills');
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [searchQuery, skillFilter, projects]);
const loadProjects = async () => {
    try {
      // Remove orderBy to avoid needing a composite index
      const q = query(
        collection(db, 'projects'),
        where('status', '==', 'open')
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
      setFilteredProjects(projectsList);

      // Extract unique skills
      const skillsSet = new Set();
      projectsList.forEach(project => {
        if (project.skillsRequired) {
          project.skillsRequired.forEach(skill => skillsSet.add(skill));
        }
      });
      setAllSkills(Array.from(skillsSet).sort());

    } catch (error) {
      console.error('Error loading projects:', error);
      alert('Failed to load projects. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };
//   const loadProjects = async () => {
//     try {
//       const q = query(
//         collection(db, 'projects'),
//         where('status', '==', 'open'),
//         orderBy('createdAt', 'desc')
//       );

//       const querySnapshot = await getDocs(q);
//       const projectsList = querySnapshot.docs.map(doc => ({
//         projectId: doc.id,
//         ...doc.data()
//       }));

//       setProjects(projectsList);
//       setFilteredProjects(projectsList);

//       // Extract unique skills
//       const skillsSet = new Set();
//       projectsList.forEach(project => {
//         if (project.skillsRequired) {
//           project.skillsRequired.forEach(skill => skillsSet.add(skill));
//         }
//       });
//       setAllSkills(Array.from(skillsSet).sort());

//     } catch (error) {
//       console.error('Error loading projects:', error);
//       alert('Failed to load projects. Please refresh the page.');
//     } finally {
//       setLoading(false);
//     }
//   };

  const filterProjects = () => {
    let filtered = [...projects];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => {
        return (
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.facultyName.toLowerCase().includes(query) ||
          (project.skillsRequired && project.skillsRequired.some(skill => 
            skill.toLowerCase().includes(query)
          ))
        );
      });
    }

    // Apply skill filter
    if (skillFilter !== 'All Skills') {
      filtered = filtered.filter(project => 
        project.skillsRequired && project.skillsRequired.includes(skillFilter)
      );
    }

    setFilteredProjects(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="student" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Research Projects</h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''} available`}
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, description, faculty, or skills..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            {/* Skills Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white transition-all duration-200"
              >
                <option value="All Skills">All Skills</option>
                {allSkills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {searchQuery || skillFilter !== 'All Skills'
                ? 'No projects match your filters. Try adjusting your search.'
                : 'No projects available yet. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard key={project.projectId} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;