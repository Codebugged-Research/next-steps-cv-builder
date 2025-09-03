import React from 'react';
import FormField from '../forms/FormField';
import FormGrid from '../forms/FormGrid';

const BasicDetailsStep = ({ formData, onInputChange }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#04445E] mb-6">Basic Details</h2>
    
    <FormGrid>
      <FormField
        label="Full Name"
        type="text"
        value={formData.basicDetails.fullName}
        onChange={(value) => onInputChange('basicDetails', 'fullName', value)}
      />
      
      <FormField
        label="Email"
        type="email"
        value={formData.basicDetails.email}
        onChange={(value) => onInputChange('basicDetails', 'email', value)}
      />
      
      <FormField
        label="Phone"
        type="tel"
        value={formData.basicDetails.phone}
        onChange={(value) => onInputChange('basicDetails', 'phone', value)}
      />
      
      <FormField
        label="Medical School"
        type="text"
        value={formData.basicDetails.medicalSchool}
        onChange={(value) => onInputChange('basicDetails', 'medicalSchool', value)}
      />
      
      <FormField
        label="Graduation Year"
        type="text"
        value={formData.basicDetails.graduationYear}
        onChange={(value) => onInputChange('basicDetails', 'graduationYear', value)}
      />
      
      <FormField
        label="City"
        type="text"
        value={formData.basicDetails.city}
        onChange={(value) => onInputChange('basicDetails', 'city', value)}
      />
    </FormGrid>
  </div>
);

export default BasicDetailsStep;