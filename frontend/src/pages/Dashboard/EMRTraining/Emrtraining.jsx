import React, { useState, useEffect } from 'react';
import { Calendar, Play, Clock, Users, ExternalLink, CheckCircle, X, FileText, Loader, MapPin } from 'lucide-react';
import HipaaAgreementComponent from './HipaaAgreeement';
import HipaaContent from './HipaaContent';
import ConfirmationModal from '../../../components/Common/ConfirmationModal';
import api from '../../../services/api.js';
import { toast } from 'react-toastify';

const EmrTrainingComponent = () => {
  const [activeTab, setActiveTab] = useState('book');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [registrations, setRegistrations] = useState([]);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [showHipaaContent, setShowHipaaContent] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

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

  // Demo training sessions
  const demoTrainingSessions = {
    'January': [
      {
        id: 'demo-1',
        title: 'EMR System Fundamentals',
        description: 'Comprehensive training covering EMR basics, patient registration, appointment scheduling, and basic documentation.',
        date: 'January 15, 2025',
        time: '10:00 AM - 12:00 PM',
        duration: '2 hours',
        instructor: 'Dr. Sarah Johnson',
        level: 'Beginner',
        location: 'Virtual - Zoom',
        capacity: 25,
        enrolled: 12,
        category: 'EMR Training'
      },
      {
        id: 'demo-2',
        title: 'Advanced EMR Documentation',
        description: 'Learn advanced documentation techniques, templates, macros, and efficient workflow management in EMR systems.',
        date: 'January 22, 2025',
        time: '2:00 PM - 4:00 PM',
        duration: '2 hours',
        instructor: 'Dr. Michael Chen',
        level: 'Advanced',
        location: 'Virtual - Zoom',
        capacity: 20,
        enrolled: 8,
        category: 'EMR Training'
      }
    ]
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    const checkHipaaStatus = async () => {
      try {
        const response = await api.get('/users/hipaa-status');
        if (response.data.success) {
          setHasAgreedToTerms(response.data.data.isSigned);
        }
      } catch (error) {
        console.error('Error checking HIPAA status:', error);
      } finally {
        setIsLoadingStatus(false);
      }
    };
    checkHipaaStatus();
  }, []);

  const handleRegisterClick = (session) => {
    setSelectedSession(session);
    setSelectedSessionId(session.id);
    setShowRegistrationModal(true);
  };

  const confirmRegistration = async () => {
    try {
      // Your API call here
      // const response = await api.post(`/emr-training/${selectedSessionId}/register`);
      
      // Add to registrations (demo)
      const newRegistration = {
        id: selectedSessionId,
        title: selectedSession.title,
        level: selectedSession.level,
        status: 'Confirmed',
        description: selectedSession.description,
        date: selectedSession.date.split(',')[0].split(' ')[1],
        time: selectedSession.time,
        registeredDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
      
      setRegistrations([...registrations, newRegistration]);
      toast.success('Successfully registered for training session!');
      setActiveTab('registrations');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setShowRegistrationModal(false);
      setSelectedSessionId(null);
      setSelectedSession(null);
    }
  };

  const handleCancelRegistration = (sessionId) => {
    setRegistrations(registrations.filter(r => r.id !== sessionId));
    toast.success('Registration cancelled successfully');
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
    setActiveTab('recordings');
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const TrainingSessionCard = ({ session }) => {
    const isRegistered = registrations.some(r => r.id === session.id);
    const availableSeats = session.capacity - session.enrolled;

    return (
      <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-[#04445E] mb-2">{session.title}</h3>
          <div className="flex gap-2 flex-wrap">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(session.level)}`}>
              {session.level}
            </span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {session.category}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {session.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-[#169AB4]" />
            <span>{session.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-[#169AB4]" />
            <span>{session.time} ({session.duration})</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-[#169AB4]" />
            <span>{session.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4 text-[#169AB4]" />
            <span>{availableSeats} seats available (of {session.capacity})</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4 text-[#169AB4]" />
            <span>Instructor: {session.instructor}</span>
          </div>
        </div>

        {isRegistered ? (
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
          >
            <CheckCircle className="h-4 w-4" />
            Already Registered
          </button>
        ) : availableSeats > 0 ? (
          <button
            onClick={() => handleRegisterClick(session)}
            className="w-full px-4 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors font-medium"
          >
            Register Now
          </button>
        ) : (
          <button
            disabled
            className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium"
          >
            Fully Booked
          </button>
        )}
      </div>
    );
  };

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
          <span>{registration.date} • {registration.time}</span>
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

  // Get sessions for selected month
  const sessionsForMonth = demoTrainingSessions[selectedMonth] || [];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {showAgreement && (
        <HipaaAgreementComponent
          onAccept={handleAgreementAccept}
          onDecline={handleAgreementDecline}
          onClose={() => setShowAgreement(false)}
        />
      )}
      {showHipaaContent && (
        <HipaaContent onClose={() => setShowHipaaContent(false)} />
      )}

      <div className="flex justify-between items-center border-b border-gray-200 mb-8">
        <div className="flex">
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
        <button
          onClick={() => setShowHipaaContent(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#04445E] text-white rounded-lg hover:bg-[#06617f] transition-colors font-medium"
        >
          <FileText className="h-4 w-4" />
          HIPAA Agreement
        </button>
      </div>

      {activeTab === 'book' && hasAgreedToTerms && (
        <div>
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

          {sessionsForMonth.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-[#04445E] mb-4">
                Available Training Sessions for {selectedMonth}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessionsForMonth.map((session) => (
                  <TrainingSessionCard key={session.id} session={session} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">Training Sessions for {selectedMonth}</h3>
              <p>No training sessions currently available for {selectedMonth} 2025</p>
              <p className="text-sm mt-2">Check back later or select another month</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'book' && !hasAgreedToTerms && (
        <div className="text-center py-12 text-gray-500">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="mb-2 font-semibold text-lg">HIPAA Compliance Agreement Required</p>
          <p className="text-sm mb-4">Please accept the terms and conditions to access training booking</p>
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
          <h2 className="text-xl font-semibold text-[#04445E] mb-6">
            Available Recordings
          </h2>
          <a
            href="https://app.nextstepscareer.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#04445E] text-white px-6 py-3 rounded-lg shadow hover:bg-[#06617f] transition font-medium"
          >
            <ExternalLink className="h-5 w-5" />
            Click here to access NextSteps App
          </a>
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
              <p className="font-semibold text-lg mb-2">No active registrations</p>
              <p className="text-sm">Register for training sessions to see them here</p>
            </div>
          )}
        </div>
      )}

      {/* Registration Disclaimer Modal */}
      <ConfirmationModal
        isOpen={showRegistrationModal}
        onClose={() => {
          setShowRegistrationModal(false);
          setSelectedSessionId(null);
          setSelectedSession(null);
        }}
        onConfirm={confirmRegistration}
        title="Confirm Registration"
        type="warning"
        confirmText="Yes, Proceed"
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <p className="text-gray-700 font-semibold text-base">
            Are you sure you want to proceed to registration?
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> This cannot be cancelled once registered after a certain period.
            </p>
          </div>
        </div>
      </ConfirmationModal>
    </div>
  );
};

export default EmrTrainingComponent;