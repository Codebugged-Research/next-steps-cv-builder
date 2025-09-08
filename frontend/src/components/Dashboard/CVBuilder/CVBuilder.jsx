import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import StepContent from './StepContent';
import NavigationControls from './NavigationControls';
import CVProgress from './CVProgress';
import api from '../../../utils/api.js';
import {toast} from 'react-toastify';
import CVPreview from './CVPreview.jsx';



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

const CVBuilder = ({ onPreview ,user}) => {
  const [formData, setFormData] = useState(initialCVData);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const totalSteps = 10;

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
      const response = await api.post('/cv/save', {
        userId: user?.id,
        ...formData
      });
      toast.success("CV Saved Successfully")
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to save CV';
      toast.error(errorMessage);
    }
    console.log('Saved CV Data:', formData);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };
  const handleBackFromPreview = () => {
    setShowPreview(false);

  };
  if (showPreview) {
    return <CVPreview cvData={formData} onClose={() => setShowPreview(false)}  onBack={handleBackFromPreview}/>;
  }


  return (
    <div className="bg-white rounded-xl shadow-lg p-8 ">
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