import { Calendar, MapPin, Globe, Clock } from 'lucide-react';

const ConferenceCard = ({ conference, onRegister }) => {
  const getSlotPercentage = (current, total) => {
    return (current / total) * 100;
  };

  const getAvailabilityColor = (current, total) => {
    const percentage = (current / total) * 100;
    if (percentage === 100) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#04445E] mb-2">{conference.title}</h3>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-3">
            {conference.category}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#04445E]">${conference.price}</div>
          <div className="text-gray-500 text-sm">Registration</div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {conference.description}
      </p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-[#169AB4]" />
          <span>{conference.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-[#169AB4]" />
          <span>{conference.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Globe className="h-4 w-4 text-[#169AB4]" />
          <span>{conference.format}</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Active Slots:</span>
            <span className={`text-sm font-medium ${getAvailabilityColor(conference.activeSlots.current, conference.activeSlots.total)}`}>
              {conference.activeSlots.current}/{conference.activeSlots.total} available
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getSlotPercentage(conference.activeSlots.current, conference.activeSlots.total)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Passive Slots:</span>
            <span className={`text-sm font-medium ${getAvailabilityColor(conference.passiveSlots.current, conference.passiveSlots.total)}`}>
              {conference.passiveSlots.current}/{conference.passiveSlots.total} available
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getSlotPercentage(conference.passiveSlots.current, conference.passiveSlots.total)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Deadline: {conference.deadline}</span>
        </div>
        <button
          onClick={() => onRegister(conference.id)}
          className="px-6 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors font-medium"
        >
          Register Now
        </button>
      </div>
    </div>
  );
};

export default ConferenceCard;