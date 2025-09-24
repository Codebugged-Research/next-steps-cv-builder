import React, { useState } from 'react';
import { Calendar, Play, Clock, Users, ExternalLink, CheckCircle, X } from 'lucide-react';

const EmrTrainingComponent = () => {
  const [activeTab, setActiveTab] = useState('book');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [registrations, setRegistrations] = useState([]);

  const trainingSessions = {
    // 'January': [
    //   {
    //     id: 1,
    //     title: 'EMR Basics: Getting Started',
    //     description: 'Learn the fundamentals of Electronic Medical Records, including navigation, patient lookup, and basic documentation.',
    //     date: '15',
    //     time: '10:00 AM - 12:00 PM',
    //     instructor: 'Dr. Sarah Johnson',
    //     capacity: 25,
    //     enrolled: 18,
    //     level: 'Beginner'
    //   },
    //   {
    //     id: 2,
    //     title: 'Advanced Charting Techniques',
    //     description: 'Master advanced documentation features, templates, and efficient workflows for comprehensive patient care.',
    //     date: '22',
    //     time: '2:00 PM - 4:00 PM',
    //     instructor: 'Dr. Michael Chen',
    //     capacity: 20,
    //     enrolled: 15,
    //     level: 'Advanced'
    //   },
    //   {
    //     id: 3,
    //     title: 'Prescription Management',
    //     description: 'Complete guide to electronic prescribing, drug interactions, and medication history management.',
    //     date: '29',
    //     time: '9:00 AM - 11:00 AM',
    //     instructor: 'Dr. Emily Rodriguez',
    //     capacity: 30,
    //     enrolled: 22,
    //     level: 'Intermediate'
    //   }
    // ],
    // 'February': [
    //   {
    //     id: 4,
    //     title: 'Lab Results Integration',
    //     description: 'Learn to efficiently manage and interpret lab results within the EMR system.',
    //     date: '5',
    //     time: '11:00 AM - 1:00 PM',
    //     instructor: 'Dr. James Wilson',
    //     capacity: 25,
    //     enrolled: 12,
    //     level: 'Intermediate'
    //   },
    //   {
    //     id: 5,
    //     title: 'Patient Communication Tools',
    //     description: 'Utilize EMR messaging, portal management, and patient engagement features effectively.',
    //     date: '12',
    //     time: '3:00 PM - 5:00 PM',
    //     instructor: 'Dr. Lisa Thompson',
    //     capacity: 20,
    //     enrolled: 8,
    //     level: 'Beginner'
    //   }
    // ],
    // 'March': [
    //   {
    //     id: 6,
    //     title: 'Billing & Documentation',
    //     description: 'Master proper documentation for accurate billing and compliance requirements.',
    //     date: '8',
    //     time: '1:00 PM - 3:00 PM',
    //     instructor: 'Dr. Robert Kim',
    //     capacity: 30,
    //     enrolled: 25,
    //     level: 'Advanced'
    //   }
    // ]
  };

  // Sample recordings data
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

  const handleRegister = (sessionId) => {
    const session = Object.values(trainingSessions).flat().find(s => s.id === sessionId);
    if (session && !registrations.find(r => r.id === sessionId)) {
      setRegistrations([...registrations, { 
        ...session, 
        registeredDate: new Date().toLocaleDateString(),
        status: 'Registered'
      }]);
    }
  };

  const handleCancelRegistration = (sessionId) => {
    setRegistrations(registrations.filter(r => r.id !== sessionId));
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const TrainingCard = ({ session, showRegisterButton = true }) => (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#04445E] mb-2">{session.title}</h3>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(session.level)}`}>
            {session.level}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">
        {session.description}
      </p>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-[#169AB4]" />
          <span>{selectedMonth} {session.date}, 2025 • {session.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4 text-[#169AB4]" />
          <span>{session.enrolled}/{session.capacity} enrolled • {session.instructor}</span>
        </div>
      </div>
      
      {showRegisterButton && (
        <div className="flex justify-end items-center mt-auto">
          <button
            onClick={() => handleRegister(session.id)}
            disabled={registrations.find(r => r.id === session.id) || session.enrolled >= session.capacity}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              registrations.find(r => r.id === session.id) 
                ? 'bg-green-100 text-green-800 cursor-not-allowed'
                : session.enrolled >= session.capacity
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-[#169AB4] text-white hover:bg-[#147a8f]'
            }`}
          >
            {registrations.find(r => r.id === session.id) 
              ? 'Registered' 
              : session.enrolled >= session.capacity 
              ? 'Full' 
              : 'Register Now'
            }
          </button>
        </div>
      )}
    </div>
  );

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
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('book')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'book' 
              ? 'border-[#169AB4] text-[#169AB4]' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Book Training
        </button>
        <button
          onClick={() => setActiveTab('recordings')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'recordings' 
              ? 'border-[#169AB4] text-[#169AB4]' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          View Recordings
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

      {activeTab === 'book' && (
        <div>
          {/* Month Selector */}
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

          {/* Training Sessions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingSessions[selectedMonth]?.map((session) => (
              <TrainingCard key={session.id} session={session} />
            )) || (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No training sessions scheduled for {selectedMonth}</p>
              </div>
            )}
          </div>
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
          <h2 className="text-xl font-semibold text-[#04445E] mb-6">Your Registrations</h2>
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