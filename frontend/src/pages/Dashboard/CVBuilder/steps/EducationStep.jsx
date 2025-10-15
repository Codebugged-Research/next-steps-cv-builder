import React, { useState, useCallback } from 'react';
import FormField from '../forms/FormField';
import FormGrid from '../forms/FormGrid';
import { GraduationCap, School, BookOpen, Award } from 'lucide-react';

const EducationStep = ({ formData, onInputChange }) => {
  const [activeTab, setActiveTab] = useState('schooling');

  const tabs = [
    { id: 'schooling', label: 'Schooling', icon: School },
    { id: 'college', label: 'College (+1 & +2)', icon: BookOpen },
    { id: 'graduation', label: 'Graduation', icon: GraduationCap },
    { id: 'postGraduation', label: 'Post Graduation', icon: Award }
  ];

  const handleTabClick = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const updateSubSection = useCallback((subsection, field, value) => {
    const updatedSubsection = {
      ...formData.education?.[subsection],
      [field]: value
    };
    onInputChange('education', subsection, updatedSubsection);
  }, [formData.education, onInputChange]);

  const TabButton = ({ tab, isActive }) => {
    const Icon = tab.icon;
    return (
      <button
        onClick={() => handleTabClick(tab.id)}
        className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-[#169AB4] text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Icon className="h-4 w-4" />
        <span className="font-medium">{tab.label}</span>
      </button>
    );
  };

  const SchoolingTab = () => (
    <div className="space-y-6">
      <FormGrid>
        <FormField
          label="School Name"
          type="text"
          value={formData.education?.schooling?.schoolName || ''}
          onChange={(value) => updateSubSection('schooling', 'schoolName', value)}
          required
        />
        
        <FormField
          label="Board"
          type="text"
          value={formData.education?.schooling?.board || ''}
          onChange={(value) => updateSubSection('schooling', 'board', value)}
          required
        />
        
        <FormField
          label="City"
          type="text"
          value={formData.education?.schooling?.city || ''}
          onChange={(value) => updateSubSection('schooling', 'city', value)}
          required
        />
        
        <FormField
          label="State"
          type="text"
          value={formData.education?.schooling?.state || ''}
          onChange={(value) => updateSubSection('schooling', 'state', value)}
          required
        />
        
        <FormField
          label="Start Year"
          type="number"
          value={formData.education?.schooling?.startYear || ''}
          onChange={(value) => updateSubSection('schooling', 'startYear', value)}
          min="1990"
          max={new Date().getFullYear()}
          required
        />
        
        <FormField
          label="End Year"
          type="number"
          value={formData.education?.schooling?.endYear || ''}
          onChange={(value) => updateSubSection('schooling', 'endYear', value)}
          min="1990"
          max={new Date().getFullYear()}
          required
        />
        
        <FormField
          label="Grade/Percentage"
          type="text"
          value={formData.education?.schooling?.grade || ''}
          onChange={(value) => updateSubSection('schooling', 'grade', value)}
          placeholder="e.g., 85% or A+"
        />
      </FormGrid>
    </div>
  );

  const CollegeTab = () => (
    <div className="space-y-6">
      <FormGrid>
        <FormField
          label="College Name"
          type="text"
          value={formData.education?.college?.collegeName || ''}
          onChange={(value) => updateSubSection('college', 'collegeName', value)}
          required
        />
        
        <FormField
          label="Stream"
          type="select"
          options={['Science', 'Commerce', 'Arts', 'Other']}
          value={formData.education?.college?.stream || ''}
          onChange={(value) => updateSubSection('college', 'stream', value)}
          required
        />
        
        <FormField
          label="City"
          type="text"
          value={formData.education?.college?.city || ''}
          onChange={(value) => updateSubSection('college', 'city', value)}
          required
        />
        
        <FormField
          label="State"
          type="text"
          value={formData.education?.college?.state || ''}
          onChange={(value) => updateSubSection('college', 'state', value)}
          required
        />
        
        <FormField
          label="Start Year"
          type="number"
          value={formData.education?.college?.startYear || ''}
          onChange={(value) => updateSubSection('college', 'startYear', value)}
          min="1990"
          max={new Date().getFullYear()}
          required
        />
        
        <FormField
          label="End Year"
          type="number"
          value={formData.education?.college?.endYear || ''}
          onChange={(value) => updateSubSection('college', 'endYear', value)}
          min="1990"
          max={new Date().getFullYear()}
          required
        />
      </FormGrid>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="11th Grade (%)"
          type="text"
          value={formData.education?.college?.eleventhGrade || ''}
          onChange={(value) => updateSubSection('college', 'eleventhGrade', value)}
          placeholder="e.g., 85%"
        />
        
        <FormField
          label="12th Grade (%)"
          type="text"
          value={formData.education?.college?.twelfthGrade || ''}
          onChange={(value) => updateSubSection('college', 'twelfthGrade', value)}
          placeholder="e.g., 90%"
        />
      </div>
    </div>
  );

  const GraduationTab = () => (
    <div className="space-y-6">
      <FormGrid>
        <FormField
          label="University/College Name"
          type="text"
          value={formData.education?.graduation?.universityName || ''}
          onChange={(value) => updateSubSection('graduation', 'universityName', value)}
          required
        />
        
        <FormField
          label="Degree"
          type="select"
          options={['MBBS', 'BDS', 'BAMS', 'BHMS', 'B.Sc', 'Other']}
          value={formData.education?.graduation?.degree || ''}
          onChange={(value) => updateSubSection('graduation', 'degree', value)}
          required
        />
        
        <FormField
          label="Specialization"
          type="text"
          value={formData.education?.graduation?.specialization || ''}
          onChange={(value) => updateSubSection('graduation', 'specialization', value)}
        />
        
        <FormField
          label="City"
          type="text"
          value={formData.education?.graduation?.city || ''}
          onChange={(value) => updateSubSection('graduation', 'city', value)}
          required
        />
        
        <FormField
          label="State"
          type="text"
          value={formData.education?.graduation?.state || ''}
          onChange={(value) => updateSubSection('graduation', 'state', value)}
          required
        />
        
        <FormField
          label="Country"
          type="text"
          value={formData.education?.graduation?.country || ''}
          onChange={(value) => updateSubSection('graduation', 'country', value)}
          required
        />
        
        <FormField
          label="Start Date"
          type="date"
          value={formData.education?.graduation?.startDate || ''}
          onChange={(value) => updateSubSection('graduation', 'startDate', value)}
          required
        />
        
        <FormField
          label="End Date"
          type="date"
          value={formData.education?.graduation?.endDate || ''}
          onChange={(value) => updateSubSection('graduation', 'endDate', value)}
          required
        />
      </FormGrid>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FormField
          label="1st Year (%)"
          type="text"
          value={formData.education?.graduation?.firstYearPercentage || ''}
          onChange={(value) => updateSubSection('graduation', 'firstYearPercentage', value)}
          placeholder="e.g., 85%"
        />
        
        <FormField
          label="2nd Year (%)"
          type="text"
          value={formData.education?.graduation?.secondYearPercentage || ''}
          onChange={(value) => updateSubSection('graduation', 'secondYearPercentage', value)}
          placeholder="e.g., 87%"
        />
        
        <FormField
          label="3rd Year (%)"
          type="text"
          value={formData.education?.graduation?.thirdYearPercentage || ''}
          onChange={(value) => updateSubSection('graduation', 'thirdYearPercentage', value)}
          placeholder="e.g., 89%"
        />
        
        <FormField
          label="Final Year (%)"
          type="text"
          value={formData.education?.graduation?.finalYearPercentage || ''}
          onChange={(value) => updateSubSection('graduation', 'finalYearPercentage', value)}
          placeholder="e.g., 91%"
        />
      </div>

      <FormGrid>
        <FormField
          label="Overall CGPA/Percentage"
          type="text"
          value={formData.education?.graduation?.overallGrade || ''}
          onChange={(value) => updateSubSection('graduation', 'overallGrade', value)}
          placeholder="e.g., 8.5 CGPA or 85%"
        />
        
        <FormField
          label="Class Type"
          type="select"
          options={['First Class with Distinction', 'First Class', 'Second Class', 'Pass Class']}
          value={formData.education?.graduation?.classType || ''}
          onChange={(value) => updateSubSection('graduation', 'classType', value)}
        />
      </FormGrid>
    </div>
  );

  const PostGraduationTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          Fill this section only if you have completed or are pursuing post-graduation.
        </p>
      </div>

      <FormGrid>
        <FormField
          label="University/Institute Name"
          type="text"
          value={formData.education?.postGraduation?.universityName || ''}
          onChange={(value) => updateSubSection('postGraduation', 'universityName', value)}
        />
        
        <FormField
          label="Degree"
          type="select"
          options={['MD', 'MS', 'DNB', 'DM', 'MCh', 'M.Sc', 'Other']}
          value={formData.education?.postGraduation?.degree || ''}
          onChange={(value) => updateSubSection('postGraduation', 'degree', value)}
        />
        
        <FormField
          label="Specialization"
          type="text"
          value={formData.education?.postGraduation?.specialization || ''}
          onChange={(value) => updateSubSection('postGraduation', 'specialization', value)}
        />
        
        <FormField
          label="City"
          type="text"
          value={formData.education?.postGraduation?.city || ''}
          onChange={(value) => updateSubSection('postGraduation', 'city', value)}
        />
        
        <FormField
          label="State"
          type="text"
          value={formData.education?.postGraduation?.state || ''}
          onChange={(value) => updateSubSection('postGraduation', 'state', value)}
        />
        
        <FormField
          label="Country"
          type="text"
          value={formData.education?.postGraduation?.country || ''}
          onChange={(value) => updateSubSection('postGraduation', 'country', value)}
        />
        
        <FormField
          label="Start Date"
          type="date"
          value={formData.education?.postGraduation?.startDate || ''}
          onChange={(value) => updateSubSection('postGraduation', 'startDate', value)}
        />
        
        <FormField
          label="End Date"
          type="date"
          value={formData.education?.postGraduation?.endDate || ''}
          onChange={(value) => updateSubSection('postGraduation', 'endDate', value)}
        />
        
        <FormField
          label="Status"
          type="select"
          options={['Completed', 'Pursuing', 'Dropped']}
          value={formData.education?.postGraduation?.status || ''}
          onChange={(value) => updateSubSection('postGraduation', 'status', value)}
        />
        
        <FormField
          label="Overall Grade/CGPA"
          type="text"
          value={formData.education?.postGraduation?.overallGrade || ''}
          onChange={(value) => updateSubSection('postGraduation', 'overallGrade', value)}
          placeholder="e.g., 8.5 CGPA or 85%"
        />
      </FormGrid>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'schooling':
        return <SchoolingTab />;
      case 'college':
        return <CollegeTab />;
      case 'graduation':
        return <GraduationTab />;
      case 'postGraduation':
        return <PostGraduationTab />;
      default:
        return <SchoolingTab />;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#04445E] mb-6">Education Details</h2>
      
      <div className="flex flex-wrap gap-2 mb-6 p-2 bg-gray-50 rounded-lg">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default EducationStep;