import { Mail, User, Clock, DollarSign, Users, Calendar } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const handleContactFaculty = () => {
    const subject = encodeURIComponent(`Interest in Research Project: ${project.title}`);
    const body = encodeURIComponent(
      `Dear ${project.facultyName},\n\nI am interested in the research project "${project.title}" and would like to discuss the opportunity further.\n\nBest regards`
    );
    window.location.href = `mailto:${project.facultyEmail}?subject=${subject}&body=${body}`;
  };

  // Truncate description if too long
  const truncatedDescription = project.description.length > 150
    ? project.description.substring(0, 150) + '...'
    : project.description;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 flex flex-col h-full">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex-1">{project.title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ml-2 ${
            project.status === 'open'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {project.status === 'open' ? 'Open' : 'Closed'}
        </span>
      </div>

      {/* Faculty Information */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center text-gray-600">
          <User className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">{project.facultyName}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Mail className="h-4 w-4 mr-2" />
          <a
            href={`mailto:${project.facultyEmail}`}
            className="text-sm text-indigo-600 hover:underline"
          >
            {project.facultyEmail}
          </a>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4 flex-1">{truncatedDescription}</p>

      {/* Skills Section */}
      {project.skillsRequired && project.skillsRequired.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">Required Skills:</p>
          <div className="flex flex-wrap gap-2">
            {project.skillsRequired.map((skill, index) => (
              <span
                key={index}
                className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span>{project.duration}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <DollarSign className="h-4 w-4 mr-2" />
          <span>{project.stipend}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Users className="h-4 w-4 mr-2" />
          <span>{project.positions} position{project.positions > 1 ? 's' : ''}</span>
        </div>
        {project.deadline && (
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(project.deadline).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={handleContactFaculty}
        disabled={project.status === 'closed'}
        className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${
          project.status === 'open'
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {project.status === 'open' ? 'Contact Faculty' : 'Position Closed'}
      </button>
    </div>
  );
};

export default ProjectCard;