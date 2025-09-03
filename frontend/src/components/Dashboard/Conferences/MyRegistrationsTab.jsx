import { Calendar } from 'lucide-react';

const MyRegistrationsTab = ({ registrations }) => {
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
        <div key={registration.id} className="border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-[#04445E] mb-2">{registration.title}</h4>
          <p className="text-gray-600 text-sm">Registration confirmed</p>
        </div>
      ))}
    </div>
  );
};

export default MyRegistrationsTab;