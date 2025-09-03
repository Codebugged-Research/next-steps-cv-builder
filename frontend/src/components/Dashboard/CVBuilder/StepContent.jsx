import BasicDetailsStep from './steps/BasicDetailsStep';
import EducationStep from './steps/EducationStep';
import USMLEScoresStep from './steps/USMLEScoresStep';
import SkillsStep from './steps/SkillsStep';
import AchievementsStep from './steps/AchievementsStep';
import PublicationsStep from './steps/PublicationsStep';
import ConferencesStep from './steps/ConferencesStep';
// import WorkshopsStep from './steps/WorkshopsStep';
import EMRTrainingStep from './steps/EMRTrainingStep';
import ReviewStep from './steps/ReviewStep';

const stepComponents = {
  1: BasicDetailsStep,
  2: EducationStep,
  3: USMLEScoresStep,
  4: SkillsStep,
  5: AchievementsStep,
  6: PublicationsStep,
  7: ConferencesStep,
  8: EMRTrainingStep,
  9: ReviewStep
};

const StepContent = ({ currentStep, formData, onInputChange, onArrayAdd, onArrayRemove }) => {
  const StepComponent = stepComponents[currentStep];
  
  if (!StepComponent) return null;
  
  return (
    <StepComponent
      formData={formData}
      onInputChange={onInputChange}
      onArrayAdd={onArrayAdd}
      onArrayRemove={onArrayRemove}
    />
  );
};

export default StepContent;