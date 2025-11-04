import { Clock, DollarSign, Users, Calendar, Trash2, Eye, EyeOff } from 'lucide-react';

const FacultyProjectCard = ({ project, onDelete, onToggleStatus }) => {
  const handleToggleClick = () => {
    if (window.confirm(`Are you sure you want to ${project.status === 'open' ? 'close' : 'open'} this project?`)) {
      onToggleStatus(project.projectId, project.status);
    }
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      onDelete(project.projectId);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex-1">{project.title}</h3>
        <button
          onClick={handleToggleClick}
          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold ml-2 transition-colors duration-200 ${
            project.status === 'open'
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {project.status === 'open' ? (
            <>
              <Eye className="h-4 w-4" />
              <span>Open</span>
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4" />
              <span>Closed</span>
            </>
          )}
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4">{project.description}</p>

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

      {/* Statistics Section */}
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

      {/* Created Date */}
      <p className="text-xs text-gray-500 mb-4">
        Created: {new Date(project.createdAt).toLocaleDateString()}
      </p>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleDeleteClick}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default FacultyProjectCard;