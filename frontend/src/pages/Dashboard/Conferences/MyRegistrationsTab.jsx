import { Calendar, MapPin, CheckCircle, X, Loader } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';

const MyRegistrationsTab = ({ registrations, onRefreshRegistrations }) => {
  const [cancellingId, setCancellingId] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCancelRegistration = async (registrationId) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) {
      return;
    }

    try {
      setCancellingId(registrationId);
      
      const response = await api.delete(`/conferences/registrations/${registrationId}`);
      
      if (response.data.success) {
        toast.success('Registration cancelled successfully');
        if (onRefreshRegistrations) {
          onRefreshRegistrations();
        }
      } else {
        toast.error(response.data.message || 'Failed to cancel registration');
      }
    } catch (error) {
      console.error('Error cancelling registration:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel registration');
    } finally {
      setCancellingId(null);
    }
  };

  if (registrations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No conference registrations yet</p>
        <p className="text-sm">Register for upcoming conferences to track them here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {registrations.map((registration) => (
        <div key={registration._id} className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h4 className="text-xl font-bold text-[#04445E] mb-2">
                {registration.conference?.name || registration.conference?.title}
              </h4>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 inline mr-1" />
                Registered
              </span>
            </div>
          </div>

          {registration.conference?.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {registration.conference.description}
            </p>
          )}

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-[#169AB4]" />
              <span>
                {registration.conference?.startDate && formatDate(registration.conference.startDate)}
                {registration.conference?.endDate && ` - ${formatDate(registration.conference.endDate)}`}
                {registration.conference?.month && registration.conference?.dates && !registration.conference?.startDate && 
                  `${registration.conference.month} ${registration.conference.dates}, 2025`
                }
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-[#169AB4]" />
              <span>{registration.conference?.location}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Registered on {formatDate(registration.registeredAt)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            {registration.conference?.brochureLink && (
              <a
                href={registration.conference.brochureLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-[#169AB4] border border-[#169AB4] rounded-lg hover:bg-[#169AB4] hover:text-white transition-colors text-sm"
              >
                View Brochure
              </a>
            )}
            
            <button
              onClick={() => handleCancelRegistration(registration._id)}
              disabled={cancellingId === registration._id}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                cancellingId === registration._id
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {cancellingId === registration._id ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <X className="h-4 w-4" />
                  Cancel Registration
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyRegistrationsTab;