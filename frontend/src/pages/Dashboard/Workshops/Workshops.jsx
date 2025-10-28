import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import api from '../../../services/api.js';

const WorkshopsComponent = () => {
  const [activeTab, setActiveTab] = useState('bls');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  const availableMonths = [
    { month: 'December', year: 2025 },
    { month: 'March', year: 2026 },
    { month: 'June', year: 2026 },
    { month: 'September', year: 2026 },
    { month: 'December', year: 2026 }
  ];

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

  const handleTabClick = (tab) => {
    if (!hasAgreedToTerms) {
      setShowAgreement(true);
    } else {
      setActiveTab(tab);
      setSelectedMonth(null); // Reset month selection when switching tabs
    }
  };

  const handleAgreementAccept = () => {
    setHasAgreedToTerms(true);
    setShowAgreement(false);
  };

  const handleAgreementDecline = () => {
    setShowAgreement(false);
  };

  const handleMonthSelect = (monthData) => {
    setSelectedMonth(monthData);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HIPAA Agreement Modal */}
      {showAgreement && (
        <HipaaAgreementComponent
          onAccept={handleAgreementAccept}
          onDecline={handleAgreementDecline}
          onClose={() => setShowAgreement(false)}
        />
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => handleTabClick('bls')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'bls'
              ? 'border-[#169AB4] text-[#169AB4]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          BLS Training
          {!hasAgreedToTerms && <span className="ml-2 text-xs text-red-500">*</span>}
        </button>
        <button
          onClick={() => handleTabClick('acls')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'acls'
              ? 'border-[#169AB4] text-[#169AB4]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          ACLS Training
          {!hasAgreedToTerms && <span className="ml-2 text-xs text-red-500">*</span>}
        </button>
      </div>

      {/* Content Area */}
      {!hasAgreedToTerms ? (
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
      ) : (
        <div>
          {/* Month Selector */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#04445E] mb-4">
              Select Training Month for {activeTab.toUpperCase()}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {availableMonths.map((monthData, index) => (
                <button
                  key={index}
                  onClick={() => handleMonthSelect(monthData)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedMonth?.month === monthData.month && selectedMonth?.year === monthData.year
                      ? 'border-[#169AB4] bg-[#169AB4] text-white shadow-lg'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-[#169AB4] hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2" />
                    <p className="font-semibold">{monthData.month}</p>
                    <p className="text-sm">{monthData.year}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {selectedMonth ? (
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="text-center text-gray-600">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-[#04445E] mb-2">
                  {activeTab.toUpperCase()} Training - {selectedMonth.month} {selectedMonth.year}
                </h3>
                <p className="text-gray-500 mb-4">
                  Training session details will be available soon
                </p>
                {/* <div className="inline-block bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800">
                    📅 Registration opens 2 months before the training date
                  </p>
                </div> */}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">Select a Month</h3>
              <p>Choose a training month from the options above to see available sessions</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkshopsComponent;