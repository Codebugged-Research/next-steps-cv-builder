import React, { useState,useEffect   } from 'react';
import { User, FileText, Heart, ArrowRight, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import NavigationItem from './NavigationItem';
import CVStrengtheningSection from './CVStrengtheningSection';

const Sidebar = ({ 
  activeSection, 
  onSectionChange, 
  user, 
  currentStep, 
  onStepChange, 
  completedSteps = [] 
}) => {
  const [showCVSteps, setShowCVSteps] = useState(false);
  const [showPrograms, setShowPrograms] = useState(
    ['systematic-reviews', 'case-reports', 'conferences', 'workshops', 'emr-training'].includes(activeSection)
  );

  const mainNavigationItems = [
    { id: 'cv-builder', label: 'CV Builder', icon: FileText },
  ];
  const cvSteps = [
    { id: 1, label: 'Basic Details', shortLabel: 'Basic' },
    { id: 2, label: 'Education', shortLabel: 'Education' },
    { id: 3, label: 'USMLE Scores', shortLabel: 'USMLE' },
    { id: 4, label: 'Clinical Experience', shortLabel: 'Clinical' },
    { id: 5, label: 'Skills', shortLabel: 'Skills' },
    { id: 6, label: 'Professional Experience', shortLabel: 'Experience' },
    { id: 7, label: 'Volunteer Work', shortLabel: 'Volunteer' },
    { id: 8, label: 'Achievements', shortLabel: 'Achievements' },
    { id: 9, label: 'Publications & Research', shortLabel: 'Research' },
    { id: 10, label: 'EMR & Training', shortLabel: 'Training' }
  ];

  const handleCVBuilderClick = () => {
    onSectionChange('cv-builder');
    setShowCVSteps(!showCVSteps);
    setShowPrograms(false);
  };

  const handleStepClick = (stepId) => {
    if (activeSection !== 'cv-builder') {
      onSectionChange('cv-builder');
    }
    if (onStepChange) {
      onStepChange(stepId);
    }
  };

  const handleTogglePrograms = () => {
    setShowPrograms(!showPrograms);
    setShowCVSteps(false);
  };

  const handleProgramSectionChange = (section) => {
    onSectionChange(section);
    setShowPrograms(true);
    setShowCVSteps(false);
  };

  useEffect(() => {
  if (['systematic-reviews', 'case-reports', 'conferences', 'workshops', 'emr-training'].includes(activeSection)) {
    setShowPrograms(true);
    setShowCVSteps(false);
  }
}, [activeSection]);

  return (
    <div className="w-80 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-[#04445E] to-[#169AB4] rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[#04445E]">{user?.fullName || 'User'}</h3>
            <p className="text-sm text-gray-500 uppercase">{user?.medicalSchool}</p>
          </div>
        </div>

        <nav className="space-y-2">
          {mainNavigationItems.map((item) => {
            if (item.id === 'cv-builder') {
              return (
                <div key={item.id}>
                  <button
                    onClick={handleCVBuilderClick}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                      activeSection === item.id
                        ? 'bg-[#04445E] text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${
                      activeSection === item.id ? 'text-white' : 'text-gray-500'
                    }`} />
                    <span className="font-medium flex-1">{item.label}</span>
                    {showCVSteps ? (
                      <ChevronDown className={`h-4 w-4 transition-transform ${
                        activeSection === item.id ? 'text-white' : 'text-gray-400'
                      }`} />
                    ) : (
                      <ChevronRight className={`h-4 w-4 transition-transform ${
                        activeSection === item.id ? 'text-white' : 'text-gray-400'
                      }`} />
                    )}
                  </button>

                  {showCVSteps && (
                    <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-100 pl-4">
                      {cvSteps.map((step) => {
                        const isActive = currentStep === step.id && activeSection === 'cv-builder';
                        const isCompleted = completedSteps.includes(step.id);

                        return (
                          <button
                            key={step.id}
                            onClick={() => handleStepClick(step.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-all duration-200 ${
                              isActive
                                ? 'bg-[#169AB4] text-white shadow-sm'
                                : isCompleted
                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <span className={`text-xs font-medium ${
                                  isActive ? 'text-white' : 'text-gray-500'
                                }`}>
                                  {step.id}
                                </span>
                              )}
                            </div>
                            <span className="truncate">{step.shortLabel}</span>
                            {isActive && (
                              <ArrowRight className="h-3 w-3 text-white ml-auto flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavigationItem
                key={item.id}
                {...item}
                isActive={activeSection === item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  setShowPrograms(false);
                  setShowCVSteps(false);
                }}
                color={item.color}
              />
            );
          })}

          <CVStrengtheningSection
            activeSection={activeSection}
            onSectionChange={handleProgramSectionChange}
            showPrograms={showPrograms}
            onTogglePrograms={handleTogglePrograms}
          />
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;