import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import MainContentRouter from '../MainRouterComponent/MainRouterComponent';

const DashboardLayout = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('cv-builder');
  const [currentCVStep, setCurrentCVStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section === 'cv-builder' && activeSection !== 'cv-builder') {
      setCurrentCVStep(1);
    }
  };

  const handleCVStepChange = (step) => {
    setCurrentCVStep(step);
  };

  const handleStepComplete = (step) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step].sort((a, b) => a - b));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} onLogout={onLogout} />

      <div className="flex-1 max-w-full w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 h-full">
          <Sidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            user={user}
            currentStep={activeSection === 'cv-builder' ? currentCVStep : null}
            onStepChange={activeSection === 'cv-builder' ? handleCVStepChange : null}
            completedSteps={activeSection === 'cv-builder' ? completedSteps : []}
          />
          
          <MainContentRouter
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            user={user}
            currentCVStep={currentCVStep}
            onCVStepChange={handleCVStepChange}
            onStepComplete={handleStepComplete}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;