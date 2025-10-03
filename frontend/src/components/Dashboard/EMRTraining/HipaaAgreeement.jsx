import React, { useState } from 'react';
import api from '../../../utils/api.js';
import { toast } from 'react-toastify';

const HipaaAgreementComponent = ({ onAccept, onDecline, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/users/accept-hipaa');      
      if (response.data.success) {
        toast.success('HIPAA agreement accepted successfully.');
        onAccept();
      } else {
        toast.error('Failed to save agreement. Please try again.');
      }
    } catch (error) {
      console.error('Error accepting HIPAA agreement:', error);
      toast.error('Failed to save agreement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* --- Header --- */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#04445E] text-center flex-1">
              STUDENT CONSENT & HIPAA COMPLIANCE AGREEMENT
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* --- Agreement Body --- */}
          {/* (your content remains same) */}

          {/* --- Footer Buttons --- */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <div className="flex gap-4">
              <button
                onClick={onDecline}
                disabled={isSubmitting}
                className="px-8 py-3 border-2 border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'I Agree & Accept'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HipaaAgreementComponent;
