import React from 'react';
import FormField from '../forms/FormField';

const AchievementsStep = ({ formData, onInputChange }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#04445E] mb-6">Significant Achievements</h2>
    
    <FormField
      label="Achievements & Awards"
      type="textarea"
      value={formData.significantAchievements}
      onChange={(value) => onInputChange('significantAchievements', '', value)}
      placeholder="Describe your significant achievements, awards, honors, etc."
      rows={6}
    />
  </div>
);

export default AchievementsStep;