import React, { useState, useEffect } from 'react';
import { Loader, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import ConferenceCard from '../../Common/ConferenceCard';

const UpcomingConferencesTab = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConferences = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all conferences from your backend
      const response = await api.get('/conferences');
      
      if (response.data.success) {
        setConferences(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch conferences');
      }
    } catch (error) {
      console.error('Error fetching conferences:', error);
      setError(error.response?.data?.message || 'Failed to load conferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConferences();
  }, []);

  const handleRegister = (conferenceId) => {
    console.log('Register for conference:', conferenceId);
    toast.info('Registration functionality will be implemented soon!');
  };

  const handleRefresh = () => {
    fetchConferences();
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="h-8 w-8 text-[#169AB4] animate-spin mb-4" />
        <h3 className="text-lg font-semibold text-[#04445E] mb-2">Loading conferences...</h3>
        <p className="text-gray-600">Please wait while we fetch the latest conferences.</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Conferences</h3>
        <p className="text-red-600 mb-6 text-center">{error}</p>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-6 py-3 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  // No conferences found
  if (conferences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[#04445E] mb-2">No Conferences Available</h3>
          <p className="text-gray-600 mb-6">No conferences are currently available. Check back later for updates.</p>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-6 py-3 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Conferences loaded successfully
  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-[#04445E]">Available Conferences</h2>
          <p className="text-gray-600">Found {conferences.length} conferences</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 text-[#169AB4] border border-[#169AB4] rounded-lg hover:bg-[#169AB4] hover:text-white transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Conferences Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {conferences.map((conference) => (
          <ConferenceCard
            key={conference._id}
            conference={conference}
            onRegister={handleRegister}
          />
        ))}
      </div>
    </div>
  );
};

export default UpcomingConferencesTab;