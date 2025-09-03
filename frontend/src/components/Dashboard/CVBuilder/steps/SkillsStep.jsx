import React from 'react';
import FormField from '../forms/FormField';

const SkillsStep = ({ formData, onInputChange }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#04445E] mb-6">Skills</h2>
    
    <FormField
      label="Skills & Competencies"
      type="textarea"
      value={formData.skills}
      onChange={(value) => onInputChange('skills', '', value)}
      placeholder="List your medical skills, technical competencies, languages, etc."
      rows={6}
    />
  </div>
);
export default SkillsStep;