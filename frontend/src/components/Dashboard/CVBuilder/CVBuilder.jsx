import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import StepContent from './StepContent';
import NavigationControls from './NavigationControls';
import api from '../../../utils/api.js';
import { toast } from 'react-toastify';
import CVPreview from './CVPreview.jsx';
import CVStatus from './CVStatus.jsx';

const initialCVData = {
  basicDetails: {
    fullName: '',
    email: '',
    phone: '',
    medicalSchool: '',
    graduationYear: '',
    city: ''
  },
  education: {
    medicalSchoolName: '',
    country: '',
    joiningDate: '',
    completionDate: '',
    firstYearPercentage: '',
    secondYearPercentage: '',
    preFinalYearPercentage: '',
    finalYearPercentage: '',
    hasResidency: false
  },
  usmleScores: {
    step1Status: 'not-taken',
    step2ckScore: '',
    ecfmgCertified: false
  },
  clinicalExperiences: [],
  skills: '',
  professionalExperiences: [],
  volunteerExperiences: [],
  significantAchievements: '',
  publications: [],
  conferences: [],
  workshops: [],
  emrRcmTraining: {
    emrSystems: [],
    rcmTraining: false,
    duration: ''
  }
};

const CVBuilder = ({ onPreview, user }) => {
  const [formData, setFormData] = useState(initialCVData);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [cvExists, setCvExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const totalSteps = 10;

  useEffect(() => {
    if (user?._id) {
      checkExistingCV();
    } else {
      setLoading(false);
    }
  }, [user]);

  const checkExistingCV = async () => {
    try {
      const response = await api.get(`/cv/${user._id}`);
      if (response.data.success) {
        setFormData(response.data.data);
        setCvExists(true);
      }
    } catch (error) {
      setCvExists(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section === 'skills' || section === 'significantAchievements') {
      setFormData(prev => ({ ...prev, [section]: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };

  const handleArrayAdd = (section, newItem) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem]
    }));
  };

  const handleArrayRemove = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: (prev[section] || []).filter((_, i) => i !== index)
    }));
  };

  const handleArrayUpdate = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSave = async () => {
    try {
      const response = await api.post('/cv/save', formData);
      toast.success("CV Saved Successfully");
      setCvExists(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to save CV';
      toast.error(errorMessage);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleBackFromPreview = () => {
    setShowPreview(false);
  };

  const handleEdit = () => {
    setCvExists(false);
    setCurrentStep(1);
  };

  const handleDownload = () => {
    toast.info('PDF download functionality will be implemented soon');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center py-12">
          <div className="text-xl text-[#04445E]">Loading your CV...</div>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <CVPreview 
        cvData={formData} 
        onClose={() => setShowPreview(false)} 
        onBack={handleBackFromPreview}
        onDownload={handleDownload}
      />
    );
  }

  if (cvExists) {
    return (
      <CVStatus
        cvData={formData}
        onEdit={handleEdit}
        onDownload={handleDownload}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <StepContent
        currentStep={currentStep}
        formData={formData}
        onInputChange={handleInputChange}
        onArrayAdd={handleArrayAdd}
        onArrayRemove={handleArrayRemove}
        onArrayUpdate={handleArrayUpdate}
      />
      <NavigationControls
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={() => setCurrentStep(Math.max(1, currentStep - 1))}
        onNext={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
        onSave={handleSave}
        onPreview={handlePreview}
      />
    </div>
  );
};

export default CVBuilder;