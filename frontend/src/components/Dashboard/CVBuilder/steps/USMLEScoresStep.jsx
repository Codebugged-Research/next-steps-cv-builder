import React from 'react';
import FormField from '../forms/FormField';
import FormGrid from '../forms/FormGrid';

const USMLEScoresStep = ({ formData, onInputChange }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#04445E] mb-6">USMLE Scores</h2>
    
    <FormGrid>
      <FormField
        label="Step 1 Status"
        type="select"
        value={formData.usmleScores.step1Status}
        onChange={(value) => onInputChange('usmleScores', 'step1Status', value)}
        options={[
          { value: 'not-taken', label: 'Not Taken' },
          { value: 'pass', label: 'Pass' },
          { value: 'fail', label: 'Fail' }
        ]}
      />
      
      <FormField
        label="Step 2 CK Score"
        type="text"
        value={formData.usmleScores.step2ckScore}
        onChange={(value) => onInputChange('usmleScores', 'step2ckScore', value)}
      />
    </FormGrid>

    <FormField
      label="ECFMG Certified"
      type="checkbox"
      value={formData.usmleScores.ecfmgCertified}
      onChange={(value) => onInputChange('usmleScores', 'ecfmgCertified', value)}
    />
  </div>
);

export default USMLEScoresStep;