import React from 'react';
import { Calendar, MapPin, Globe, ExternalLink } from 'lucide-react';

const ConferenceCard = ({ conference, onRegister }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#04445E] mb-2">{conference.name}</h3>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-3">
            {conference.category}
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
        {conference.description}
      </p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-[#169AB4]" />
          <span>{conference.month} {conference.dates}, 2025</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-[#169AB4]" />
          <span>{conference.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Globe className="h-4 w-4 text-[#169AB4]" />
          <span>{conference.modality}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {conference.brochureLink && (
            <a
              href={conference.brochureLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 text-[#169AB4] border border-[#169AB4] rounded-lg hover:bg-[#169AB4] hover:text-white transition-colors text-sm"
            >
              <ExternalLink className="h-3 w-3" />
              Brochure
            </a>
          )}
        </div>
        
        <button
          onClick={() => onRegister(conference._id)}
          className="px-6 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors font-medium"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default ConferenceCard;