import React, { useState } from 'react';
import { Calendar, Play, Clock, Users, ExternalLink, CheckCircle, X } from 'lucide-react';
import HipaaAgreementComponent from './HipaaAgreeement';

const EmrTrainingComponent = () => {
  const [activeTab, setActiveTab] = useState('book');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [registrations, setRegistrations] = useState([]);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

  const recordings = [
    {
      id: 1,
      title: 'EMR Basics: Getting Started',
      duration: '2h 15m',
      date: 'Dec 18, 2024',
      instructor: 'Dr. Sarah Johnson',
      views: 342,
      level: 'Beginner'
    },
    {
      id: 2,
      title: 'Advanced Charting Techniques',
      duration: '1h 45m',
      date: 'Dec 11, 2024',
      instructor: 'Dr. Michael Chen',
      views: 189,
      level: 'Advanced'
    },
    {
      id: 3,
      title: 'Patient Data Security',
      duration: '1h 30m',
      date: 'Dec 4, 2024',
      instructor: 'Dr. Amanda Davis',
      views: 256,
      level: 'Intermediate'
    }
  ];

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handleCancelRegistration = (sessionId) => {
    setRegistrations(registrations.filter(r => r.id !== sessionId));
  };

  const handleShowBookingTab = () => {
    if (!hasAgreedToTerms) {
      setShowAgreement(true);
    } else {
      setActiveTab('book');
    }
  };

  const handleAgreementAccept = () => {
    setHasAgreedToTerms(true);
    setShowAgreement(false);
    setActiveTab('book');
  };

  const handleAgreementDecline = () => {
    setShowAgreement(false);
    setActiveTab('recordings'); // Redirect to recordings tab
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const RecordingCard = ({ recording }) => (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#04445E] mb-2">{recording.title}</h3>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(recording.level)}`}>
            {recording.level}
          </span>
        </div>
      </div>
      
      <div className="space-y-3 mb-6 flex-grow">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4 text-[#169AB4]" />
          <span>{recording.duration} • {recording.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4 text-[#169AB4]" />
          <span>{recording.instructor} • {recording.views} views</span>
        </div>
      </div>
      
      <div className="flex justify-end items-center mt-auto">
        <button className="flex items-center gap-2 px-6 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors font-medium">
          <Play className="h-4 w-4" />
          Watch Now
        </button>
      </div>
    </div>
  );

  const RegistrationCard = ({ registration }) => (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#04445E] mb-2">{registration.title}</h3>
          <div className="flex gap-2">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(registration.level)}`}>
              {registration.level}
            </span>
            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {registration.status}
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">
        {registration.description}
      </p>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-[#169AB4]" />
          <span>{selectedMonth} {registration.date}, 2025 • {registration.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle className="h-4 w-4 text-[#169AB4]" />
          <span>Registered on {registration.registeredDate}</span>
        </div>
      </div>
      
      <div className="flex justify-end items-center mt-auto">
        <button
          onClick={() => handleCancelRegistration(registration.id)}
          className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {showAgreement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
            <h3 className="text-lg font-semibold mb-4">Import Your HIPAA Agreement Component Here</h3>
            <p className="text-gray-600 mb-6">Replace this placeholder with your separate HIPAA agreement JSX component.</p>
            <HipaaAgreementComponent
              onAccept={handleAgreementAccept}
              onDecline={handleAgreementDecline}
              onClose={() => setShowAgreement(false)}
            />
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleAgreementDecline}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Decline
              </button>
              <button
                onClick={handleAgreementAccept}
                className="px-4 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f]"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={handleShowBookingTab}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'book' 
              ? 'border-[#169AB4] text-[#169AB4]' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Book Training
          {!hasAgreedToTerms && <span className="ml-2 text-xs text-red-500">*</span>}
        </button>
        <button
          onClick={() => setActiveTab('recordings')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'recordings' 
              ? 'border-[#169AB4] text-[#169AB4]' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Virtual Training
        </button>
        <button
          onClick={() => setActiveTab('registrations')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'registrations' 
              ? 'border-[#169AB4] text-[#169AB4]' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Your Registrations ({registrations.length})
        </button>
      </div>

      {activeTab === 'book' && hasAgreedToTerms && (
        <div>
          {/* Month Selector Only */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#04445E] mb-4">Select Month</h2>
            <div className="flex flex-wrap gap-2">
              {months.map((month) => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedMonth === month 
                      ? 'bg-[#169AB4] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>

          {/* Placeholder for training sessions - you can fetch/display data here */}
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">Training Sessions for {selectedMonth}</h3>
            <p>No training sessions currently available for {selectedMonth} 2025</p>
            <p className="text-sm mt-2">Training sessions data can be fetched and displayed here</p>
          </div>
        </div>
      )}

      {activeTab === 'book' && !hasAgreedToTerms && (
        <div className="text-center py-12 text-gray-500">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="mb-2">HIPAA Compliance Agreement Required</p>
          <p className="text-sm">Please accept the terms and conditions to access training booking</p>
          <button
            onClick={() => setShowAgreement(true)}
            className="mt-4 px-6 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors font-medium"
          >
            Review Agreement
          </button>
        </div>
      )}

      {activeTab === 'recordings' && (
        <div>
          <h2 className="text-xl font-semibold text-[#04445E] mb-6">Available Recordings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordings.map((recording) => (
              <RecordingCard key={recording.id} recording={recording} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'registrations' && (
        <div>
          <h2 className="text-xl font-semibold text-[[#04445E] mb-6">Your Registrations</h2>
          {registrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registrations.map((registration) => (
                <RegistrationCard key={registration.id} registration={registration} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No active registrations</p>
              <p className="text-sm">Register for training sessions to see them here</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmrTrainingComponent;