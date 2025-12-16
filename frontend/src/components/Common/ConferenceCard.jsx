import React from 'react';
import { Calendar, MapPin, Users, ExternalLink, Loader } from 'lucide-react';

const ConferenceCard = ({ conference, onRegister, isLoading }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#04445E] mb-2">
            {conference.name}
          </h3>
          {conference.category && (
            <span className="inline-block px-3 py-1 text-xs font-medium bg-[#169AB4] bg-opacity-10 text-[#169AB4] rounded-full">
              {conference.category.charAt(0).toUpperCase() + conference.category.slice(1)}
            </span>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3 flex-grow">
        {conference.description}
      </p>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-[#169AB4]" />
          <span>
            {conference.month} {conference.dates}, {conference.year}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-[#169AB4]" />
          <span>{conference.location}</span>
          {conference.modality && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
              {conference.modality}
            </span>
          )}
        </div>

        {conference.organizerName && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4 text-[#169AB4]" />
            <span>{conference.organizerName}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-auto gap-2">
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
          disabled={isLoading}
          className={`px-6 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-[#169AB4] text-white hover:bg-[#147a8f]'
          }`}
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            'Book Conference'
          )}
        </button>
      </div>
    </div>
  );
};

export default ConferenceCard;