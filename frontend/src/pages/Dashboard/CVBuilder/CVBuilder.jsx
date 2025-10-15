import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ProgressBar from './ProgressBar';
import StepContent from './StepContent';
import NavigationControls from './NavigationControls';
import api from '../../../services/api.js';
import { toast } from 'react-toastify';
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
    schooling: {
      schoolName: '',
      board: '',
      city: '',
      state: '',
      startYear: '',
      endYear: '',
      grade: ''
    },
    college: {
      collegeName: '',
      stream: '',
      city: '',
      state: '',
      startYear: '',
      endYear: '',
      eleventhGrade: '',
      twelfthGrade: ''
    },
    graduation: {
      universityName: '',
      degree: '',
      specialization: '',
      city: '',
      state: '',
      country: '',
      startDate: '',
      endDate: '',
      firstYearPercentage: '',
      secondYearPercentage: '',
      thirdYearPercentage: '',
      finalYearPercentage: '',
      overallGrade: '',
      classType: ''
    },
    postGraduation: {
      universityName: '',
      degree: '',
      specialization: '',
      city: '',
      state: '',
      country: '',
      startDate: '',
      endDate: '',
      status: '',
      overallGrade: ''
    }
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

const CVBuilder = ({ onPreview, user, onStepChange, currentStep, onStepComplete }) => {
  const [formData, setFormData] = useState(initialCVData);
  const [internalCurrentStep, setInternalCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState([]);
  
  const totalSteps = 10;
  const activeStep = currentStep || internalCurrentStep;

  const calculateCompletedSteps = useCallback((data) => {
    const completed = [];
    const checks = [
      { condition: data.basicDetails?.fullName && data.basicDetails?.email, step: 1 },
      { condition: data.education?.graduation?.universityName && data.education?.graduation?.country, step: 2 },
      { condition: data.usmleScores?.step1Status, step: 3 },
      { condition: data.clinicalExperiences?.length > 0, step: 4 },
      { condition: data.skills?.trim(), step: 5 },
      { condition: data.professionalExperiences?.length > 0, step: 6 },
      { condition: data.volunteerExperiences?.length > 0, step: 7 },
      { condition: data.significantAchievements?.trim(), step: 8 },
      { condition: data.publications?.length > 0 || data.conferences?.length > 0, step: 9 },
      { condition: data.emrRcmTraining?.emrSystems?.length > 0 || data.emrRcmTraining?.rcmTraining, step: 10 }
    ];
    
    checks.forEach(({ condition, step }) => {
      if (condition) completed.push(step);
    });
    
    return completed;
  }, []);

  const checkExistingCV = useCallback(async () => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/cv/${user._id}`);
      if (response.data.success) {
        setFormData(response.data.data);
        setCompletedSteps(calculateCompletedSteps(response.data.data));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [user?._id, calculateCompletedSteps]);

  const updateCompletedSteps = useCallback((newData) => {
    const newCompleted = calculateCompletedSteps(newData);
    setCompletedSteps(newCompleted);
    
    if (onStepComplete && newCompleted.includes(activeStep) && !completedSteps.includes(activeStep)) {
      onStepComplete(activeStep);
    }
  }, [calculateCompletedSteps, activeStep, completedSteps, onStepComplete]);

  useEffect(() => {
    checkExistingCV();
  }, [checkExistingCV]);

  useEffect(() => {
    if (currentStep && currentStep !== internalCurrentStep) {
      setInternalCurrentStep(currentStep);
    }
  }, [currentStep, internalCurrentStep]);

  const handleInputChange = useCallback((section, field, value) => {
    setFormData(prevData => {
      let newData;
      if (section === 'skills' || section === 'significantAchievements') {
        newData = { ...prevData, [section]: value };
      } else if (section === 'education') {
        newData = {
          ...prevData,
          education: {
            ...prevData.education,
            [field]: value
          }
        };
      } else {
        newData = { 
          ...prevData, 
          [section]: { 
            ...prevData[section], 
            [field]: value 
          } 
        };
      }
      
      setTimeout(() => updateCompletedSteps(newData), 100);
      return newData;
    });
  }, [updateCompletedSteps]);

  const handleArrayAdd = useCallback((section, newItem) => {
    setFormData(prevData => {
      const newData = { ...prevData, [section]: [...(prevData[section] || []), newItem] };
      setTimeout(() => updateCompletedSteps(newData), 100);
      return newData;
    });
  }, [updateCompletedSteps]);

  const handleArrayRemove = useCallback((section, index) => {
    setFormData(prevData => {
      const newData = { ...prevData, [section]: (prevData[section] || []).filter((_, i) => i !== index) };
      setTimeout(() => updateCompletedSteps(newData), 100);
      return newData;
    });
  }, [updateCompletedSteps]);

  const handleArrayUpdate = useCallback((section, index, field, value) => {
    setFormData(prevData => {
      const newData = {
        ...prevData,
        [section]: prevData[section].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      };
      setTimeout(() => updateCompletedSteps(newData), 100);
      return newData;
    });
  }, [updateCompletedSteps]);

  const handleStepChange = useCallback((step) => {
    setInternalCurrentStep(step);
    onStepChange?.(step);
  }, [onStepChange]);

  const handleNext = useCallback(() => {
    const nextStep = Math.min(totalSteps, activeStep + 1);
    handleStepChange(nextStep);
  }, [totalSteps, activeStep, handleStepChange]);

  const handlePrevious = useCallback(() => {
    const prevStep = Math.max(1, activeStep - 1);
    handleStepChange(prevStep);
  }, [activeStep, handleStepChange]);

  const handleSave = useCallback(async () => {
    setFormData(prevData => {
      if (!prevData.basicDetails.graduationYear || prevData.basicDetails.graduationYear.trim() === '') {
        toast.error('Please enter your graduation year in Basic Details (Step 1)');
        handleStepChange(1);
        return prevData;
      }
      
      if (!prevData.basicDetails.medicalSchool || prevData.basicDetails.medicalSchool.trim() === '') {
        toast.error('Please enter your medical school in Basic Details (Step 1)');
        handleStepChange(1);
        return prevData;
      }

      if (!prevData.basicDetails.fullName || prevData.basicDetails.fullName.trim() === '') {
        toast.error('Please enter your full name in Basic Details (Step 1)');
        handleStepChange(1);
        return prevData;
      }

      if (!prevData.basicDetails.email || prevData.basicDetails.email.trim() === '') {
        toast.error('Please enter your email in Basic Details (Step 1)');
        handleStepChange(1);
        return prevData;
      }

      if (!prevData.basicDetails.phone || prevData.basicDetails.phone.trim() === '') {
        toast.error('Please enter your phone number in Basic Details (Step 1)');
        handleStepChange(1);
        return prevData;
      }

      if (!prevData.basicDetails.city || prevData.basicDetails.city.trim() === '') {
        toast.error('Please enter your city in Basic Details (Step 1)');
        handleStepChange(1);
        return prevData;
      }
      
      if (!user?._id) {
        toast.error('User not authenticated. Please login again.');
        return prevData;
      }

      const dataToSave = {
        ...prevData,
        userId: user._id
      };
      
      api.post('/cv/save', dataToSave)
        .then(() => toast.success("CV Saved Successfully"))
        .catch(error => {
          const errorMessage = error.response?.data?.message || 'Failed to save CV';
          toast.error(errorMessage);
        });
      
      return prevData;
    });
  }, [user?._id, handleStepChange]);

  const handlePreview = useCallback(() => setShowPreview(true), []);
  const handleBackFromPreview = useCallback(() => setShowPreview(false), []);
  
  const handleDownload = useCallback(() => {
    toast.info('PDF download functionality will be implemented soon');
  }, []);

  const memoizedProgressBar = useMemo(() => (
    <ProgressBar currentStep={activeStep} totalSteps={totalSteps} />
  ), [activeStep, totalSteps]);

  const memoizedStepContent = useMemo(() => (
    <StepContent
      currentStep={activeStep}
      formData={formData}
      onInputChange={handleInputChange}
      onArrayAdd={handleArrayAdd}
      onArrayRemove={handleArrayRemove}
      onArrayUpdate={handleArrayUpdate}
    />
  ), [activeStep, formData, handleInputChange, handleArrayAdd, handleArrayRemove, handleArrayUpdate]);

  const memoizedNavigationControls = useMemo(() => (
    <NavigationControls
      currentStep={activeStep}
      totalSteps={totalSteps}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onSave={handleSave}
      onPreview={handlePreview}
      completedSteps={completedSteps}
    />
  ), [activeStep, totalSteps, handlePrevious, handleNext, handleSave, handlePreview, completedSteps]);

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
        onClose={handleBackFromPreview} 
        onBack={handleBackFromPreview}
        onDownload={handleDownload}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {memoizedProgressBar}
      {memoizedStepContent}
      {memoizedNavigationControls}
    </div>
  );
};

export default CVBuilder;