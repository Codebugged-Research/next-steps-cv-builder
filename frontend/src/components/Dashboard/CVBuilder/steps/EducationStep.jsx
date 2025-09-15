import React from 'react';
import FormField from '../forms/FormField';
import FormGrid from '../forms/FormGrid';

const EducationStep = ({ formData, onInputChange }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#04445E] mb-6">Education Details</h2>
    
    <FormGrid>
      
      <FormField
        label="Country"
        type="text"
        value={formData.education.country}
        onChange={(value) => onInputChange('education', 'country', value)}
      />
      
      <FormField
        label="Joining Date"
        type="date"
        value={formData.education.joiningDate}
        onChange={(value) => onInputChange('education', 'joiningDate', value)}
      />
      
      <FormField
        label="Completion Date"
        type="date"
        value={formData.education.completionDate}
        onChange={(value) => onInputChange('education', 'completionDate', value)}
      />
    </FormGrid>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <FormField
        label="First Year %"
        type="text"
        value={formData.education.firstYearPercentage}
        onChange={(value) => onInputChange('education', 'firstYearPercentage', value)}
      />
      
      <FormField
        label="Second Year %"
        type="text"
        value={formData.education.secondYearPercentage}
        onChange={(value) => onInputChange('education', 'secondYearPercentage', value)}
      />
      
      <FormField
        label="Pre-Final Year %"
        type="text"
        value={formData.education.preFinalYearPercentage}
        onChange={(value) => onInputChange('education', 'preFinalYearPercentage', value)}
      />
      
      <FormField
        label="Final Year %"
        type="text"
        value={formData.education.finalYearPercentage}
        onChange={(value) => onInputChange('education', 'finalYearPercentage', value)}
      />
    </div>
  </div>
);

export default EducationStep;
