
import CVBuilder from '../Dashboard/CVBuilder/CVBuilder';
import ViewCV from '../Dashboard/ViewCV/ViewCV';
import Existingcv from '../Dashboard/ExistingCV/Existingcv';
import SystematicReviews from '../Dashboard/SystematicReview/SystematicReviews';
import CaseReports from '../Dashboard/CaseReports/CaseReports';
import Conferences from '../Dashboard/Conferences/Conferences';

const MainContentRouter = ({ 
  activeSection, 
  onSectionChange, 
  user, 
  currentCVStep, 
  onCVStepChange, 
  onStepComplete 
}) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'cv-builder':
        return (
          <CVBuilder
            key={user?._id || "guest"}
            user={user}
            currentStep={currentCVStep}
            onStepChange={onCVStepChange}
            onStepComplete={onStepComplete}
          />
        );

      case 'cv-status':
        return (
          <ViewCV
            onEdit={() => onSectionChange('cv-builder')}
          />
        );

      case 'existing-cv':
        return (
          <Existingcv onBack={() => onSectionChange('cv-builder')} />
        );

      case 'systematic-reviews':
        return (
          <SystematicReviews
            onBack={() => onSectionChange('cv-builder')}
            user={user}
          />
        );

      case 'case-reports':
        return (
          <CaseReports
            onBack={() => onSectionChange('cv-builder')}
            user={user}
          />
        );

      case 'conferences':
        return (
          <Conferences
            onBack={() => onSectionChange('cv-builder')}
            user={user}
          />
        );

      case 'workshops':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#04445E] mb-4">Workshops</h2>
            <p className="text-gray-600">Workshops component coming soon...</p>
          </div>
        );

      case 'emr-training':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#04445E] mb-4">EMR Training</h2>
            <p className="text-gray-600">EMR Training component coming soon...</p>
          </div>
        );

      default:
        return (
          <CVBuilder
            key={user?._id || "guest"}
            user={user}
            currentStep={currentCVStep}
            onStepChange={onCVStepChange}
            onStepComplete={onStepComplete}
          />
        );
    }
  };

  return (
    <div className="flex-1">
      {renderContent()}
    </div>
  );
};

export default MainContentRouter;