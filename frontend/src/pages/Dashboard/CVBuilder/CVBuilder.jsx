import React, { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import StepContent from './StepContent';
import NavigationControls from './NavigationControls';
import api from '../../../services/api.js';
import { toast } from 'react-toastify';
import CVPreview from './CVPreview.jsx';
import SaveProgressModal from '../../../components/Common/SaveProgressModal.jsx';

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
  skills: {
    skillsList: '',
    supportingDocuments: []
  },
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
  },
  aclsBls: {
    aclsCertified: false,
    blsCertified: false,
    aclsIssueDate: '',
    aclsExpiryDate: '',
    blsIssueDate: '',
    blsExpiryDate: '',
    provider: ''
  },
  workExperience: []
};

const CVBuilder = ({ onPreview, user, onStepChange, currentStep, onStepComplete }) => {
  const [formData, setFormData] = useState(initialCVData);
  const [internalCurrentStep, setInternalCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const totalSteps = 11;
  const activeStep = currentStep || internalCurrentStep;

  const calculateCompletedSteps = useCallback((data) => {
    const checks = [
      { condition: data.basicDetails?.fullName && data.basicDetails?.email, step: 1 },
      { condition: data.education?.graduation?.universityName && data.education?.graduation?.country, step: 2 },
      { condition: data.usmleScores?.step1Status, step: 3 },
      { condition: data.clinicalExperiences?.length > 0, step: 4 },
      { condition: data.skills?.skillsList?.trim(), step: 5 },
      { condition: data.professionalExperiences?.length > 0, step: 6 },
      { condition: data.volunteerExperiences?.length > 0, step: 7 },
      { condition: data.significantAchievements?.trim(), step: 8 },
      { condition: data.workshops?.length > 0, step: 9 },
      { condition: data.publications?.length > 0 || data.conferences?.length > 0, step: 10 },
      { condition: data.emrRcmTraining?.emrSystems?.length > 0 || data.emrRcmTraining?.rcmTraining, step: 11 }
    ];

    return checks.filter(({ condition }) => condition).map(({ step }) => step);
  }, []);

  const checkExistingCV = useCallback(async () => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/cv/${user._id}`);
      if (response.data.success) {
        const cvData = response.data.data;

        if (typeof cvData.skills === 'string') {
          cvData.skills = { skillsList: cvData.skills, supportingDocuments: [] };
        } else if (!cvData.skills) {
          cvData.skills = { skillsList: '', supportingDocuments: [] };
        }

        setFormData(cvData);
        setCompletedSteps(calculateCompletedSteps(cvData));
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

  const handleSaveProgress = () => {
    setShowSaveModal(true);
  };

  const confirmSaveProgress = async () => {
    setShowSaveModal(false);
    await handleSave();
    handleNext();
  };

  const cancelSaveProgress = () => setShowSaveModal(false);

  const handleInputChange = useCallback((section, field, value) => {
    setFormData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));

      if (section === 'skills') {
        if (!newData.skills) newData.skills = {};
        newData.skills[field] = value;
      } else if (section === 'significantAchievements') {
        newData.significantAchievements = value;
      } else if (section === 'education') {
        if (!newData.education) newData.education = {};
        newData.education[field] = value;
      } else {
        if (!newData[section]) newData[section] = {};
        newData[section][field] = value;
      }

      return newData;
    });
  }, []);

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
    handleStepChange(Math.min(totalSteps, activeStep + 1));
  }, [totalSteps, activeStep, handleStepChange]);

  const handlePrevious = useCallback(() => {
    handleStepChange(Math.max(1, activeStep - 1));
  }, [activeStep, handleStepChange]);

  const handleSave = useCallback(async () => {
    if (!user?._id) {
      toast.error('User not authenticated. Please login again.');
      return;
    }

    try {
      await api.post('/cv/save', { ...formData, userId: user._id });
      toast.success("CV Saved Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save CV');
    }
  }, [user?._id, formData]);


  const handlePreview = useCallback(() => setShowPreview(true), []);
  const handleBackFromPreview = useCallback(() => setShowPreview(false), []);
  const handleDownload = useCallback(() => {
    toast.info('PDF download functionality will be implemented soon');
  }, []);

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
      <ProgressBar currentStep={activeStep} totalSteps={totalSteps} />
      <StepContent
        currentStep={activeStep}
        formData={formData}
        onInputChange={handleInputChange}
        onArrayAdd={handleArrayAdd}
        onArrayRemove={handleArrayRemove}
        onArrayUpdate={handleArrayUpdate}
      />
      <NavigationControls
        currentStep={activeStep}
        totalSteps={totalSteps}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSaveProgress={handleSaveProgress}
        onPreview={handlePreview}
        completedSteps={completedSteps}
      />
      <SaveProgressModal
        open={showSaveModal}
        onConfirm={confirmSaveProgress}
        onCancel={cancelSaveProgress}
      />
    </div>
  );
};

export default CVBuilder;