import React, { useState } from 'react';
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

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

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
          onChange={(value) => onInputChange('education', 'schooling', { ...formData.education?.schooling, schoolName: value })}
          required
        />
        
        <FormField
          label="Board"
          type="text"
          value={formData.education?.schooling?.board || ''}
          onChange={(value) => onInputChange('education', 'schooling', { ...formData.education?.schooling, board: value })}
          required
        />
        
        <FormField
          label="City"
          type="text"
          value={formData.education?.schooling?.city || ''}
          onChange={(value) => onInputChange('education', 'schooling', { ...formData.education?.schooling, city: value })}
          required
        />
        
        <FormField
          label="State"
          type="text"
          value={formData.education?.schooling?.state || ''}
          onChange={(value) => onInputChange('education', 'schooling', { ...formData.education?.schooling, state: value })}
          required
        />
        
        <FormField
          label="Start Year"
          type="number"
          value={formData.education?.schooling?.startYear || ''}
          onChange={(value) => onInputChange('education', 'schooling', { ...formData.education?.schooling, startYear: value })}
          min="1990"
          max={new Date().getFullYear()}
          required
        />
        
        <FormField
          label="End Year"
          type="number"
          value={formData.education?.schooling?.endYear || ''}
          onChange={(value) => onInputChange('education', 'schooling', { ...formData.education?.schooling, endYear: value })}
          min="1990"
          max={new Date().getFullYear()}
          required
        />
        
        <FormField
          label="Grade/Percentage"
          type="text"
          value={formData.education?.schooling?.grade || ''}
          onChange={(value) => onInputChange('education', 'schooling', { ...formData.education?.schooling, grade: value })}
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
          onChange={(value) => onInputChange('education', 'college', { ...formData.education?.college, collegeName: value })}
          required
        />
        
        <FormField
          label="Stream"
          type="select"
          options={['Science', 'Commerce', 'Arts', 'Other']}
          value={formData.education?.college?.stream || ''}
          onChange={(value) => onInputChange('education', 'college', { ...formData.education?.college, stream: value })}
          required
        />
        
        <FormField
          label="City"
          type="text"
          value={formData.education?.college?.city || ''}
          onChange={(value) => onInputChange('education', 'college', { ...formData.education?.college, city: value })}
          required
        />
        
        <FormField
          label="State"
          type="text"
          value={formData.education?.college?.state || ''}
          onChange={(value) => onInputChange('education', 'college', { ...formData.education?.college, state: value })}
          required
        />
        
        <FormField
          label="Start Year"
          type="number"
          value={formData.education?.college?.startYear || ''}
          onChange={(value) => onInputChange('education', 'college', { ...formData.education?.college, startYear: value })}
          min="1990"
          max={new Date().getFullYear()}
          required
        />
        
        <FormField
          label="End Year"
          type="number"
          value={formData.education?.college?.endYear || ''}
          onChange={(value) => onInputChange('education', 'college', { ...formData.education?.college, endYear: value })}
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
          onChange={(value) => onInputChange('education', 'college', { ...formData.education?.college, eleventhGrade: value })}
          placeholder="e.g., 85%"
        />
        
        <FormField
          label="12th Grade (%)"
          type="text"
          value={formData.education?.college?.twelfthGrade || ''}
          onChange={(value) => onInputChange('education', 'college', { ...formData.education?.college, twelfthGrade: value })}
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
          onChange={(value) => onInputChange('education', 'graduation', { ...formData.education?.graduation, universityName: value })}
          required
        />
        
        <FormField
          label="Degree"
          type="select"
          options={['MBBS', 'BDS', 'BAMS', 'BHMS', 'B.Sc', 'Other']}
          value={formData.education?.graduation?.degree || ''}
          onChange={(value) => onInputChange('education', 'graduation', { ...formData.education?.graduation, degree: value })}
          required
        />
        
        <FormField
          label="Specialization"
          type="text"
          value={formData.education?.graduation?.specialization || ''}
          onChange={(value) => onInputChange('education', 'graduation', { ...formData.education?.graduation, specialization: value })}
        />
        
        <FormField
          label="City"
          type="text"
          value={formData.education?.graduation?.city || ''}
          onChange={(value) => onInputChange('education', 'graduation', { ...formData.education?.graduation, city: value })}
          required
        />
        
        <FormField
          label="State"
          type="text"
          value={formData.education?.graduation?.state || ''}
          onChange={(value) => onInputChange('education', 'graduation', { ...formData.education?.graduation, state: value })}
          required
        />
        
        <FormField
          label="Country"
          type="text"
          value={formData.education?.graduation?.country || ''}
          onChange={(value) => onInputChange('education', 'graduation', { ...formData.education?.graduation, country: value })}
          required
        />
        
        <FormField
          label="Start Date"
          type="date"
          value={formData.education?.graduation?.startDate || ''}
          onChange={(value) => onInputChange('education', 'graduation', { ...formData.education?.graduation, startDate: value })}
          required
        />
        
        <FormField
          label="End Date"
          type="date"
          value={formData.education?.graduation?.endDate || ''}
          onChange={(value) => onInputChange('education', 'graduation', { ...formData.education?.graduation, endDate: value })}
          required
        />
      </FormGrid>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FormField
          label="1st Year (%)"
          type="text"
          value={formData.education?.graduation?.firstYearPercentage || ''}
          onChange={(value) => onInputChange('education', 'graduation', { ...formData.education?.graduation, firstYearPercentage: value })}
          placeholder="e.g., 85%"
        />
        
        <FormField
          label="2nd Year (%)"
          type="text"
          value={formData.education?.graduation?.secondYearPercentage || ''}
          onChange={(value) => onInputChange('education', 'graduation', { ...formData.education?.graduation, secondYearPercentage: value })}
          placeholder="e.g., 87%"
        />
        
        <FormField
          label="3rd Year (%)"
          type="text"
          value={formData.education?.graduation?.thirdYearPercentage || ''}
          onChange={(value) => onInputChange('education', 'graduation', { ...formData.education?.graduation, thirdYearPercentage: value })}
          placeholder="e.g., 89%"
        />
        
        <FormField
          label="Final Year (%)"
          type="text"
          value={formData.education?.graduation?.finalYearPercentage || ''}
          onChange={(value) => onInputChange('education', 'graduation', { ...formData.education?.graduation, finalYearPercentage: value })}
          placeholder="e.g., 91%"
        />
      </div>

      <FormGrid>
        <FormField
          label="Overall CGPA/Percentage"
          type="text"
          value={formData.education?.graduation?.overallGrade || ''}
          onChange={(value) => onInputChange('education', 'graduation', { ...formData.education?.graduation, overallGrade: value })}
          placeholder="e.g., 8.5 CGPA or 85%"
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
          onChange={(value) => onInputChange('education', 'postGraduation', { ...formData.education?.postGraduation, universityName: value })}
        />
        
        <FormField
          label="Degree"
          type="select"
          options={['MD', 'MS', 'DNB', 'DM', 'MCh', 'M.Sc', 'Other']}
          value={formData.education?.postGraduation?.degree || ''}
          onChange={(value) => onInputChange('education', 'postGraduation', { ...formData.education?.postGraduation, degree: value })}
        />
        
        <FormField
          label="Specialization"
          type="text"
          value={formData.education?.postGraduation?.specialization || ''}
          onChange={(value) => onInputChange('education', 'postGraduation', { ...formData.education?.postGraduation, specialization: value })}
        />
        
        <FormField
          label="City"
          type="text"
          value={formData.education?.postGraduation?.city || ''}
          onChange={(value) => onInputChange('education', 'postGraduation', { ...formData.education?.postGraduation, city: value })}
        />
        
        <FormField
          label="State"
          type="text"
          value={formData.education?.postGraduation?.state || ''}
          onChange={(value) => onInputChange('education', 'postGraduation', { ...formData.education?.postGraduation, state: value })}
        />
        
        <FormField
          label="Country"
          type="text"
          value={formData.education?.postGraduation?.country || ''}
          onChange={(value) => onInputChange('education', 'postGraduation', { ...formData.education?.postGraduation, country: value })}
        />
        
        <FormField
          label="Start Date"
          type="date"
          value={formData.education?.postGraduation?.startDate || ''}
          onChange={(value) => onInputChange('education', 'postGraduation', { ...formData.education?.postGraduation, startDate: value })}
        />
        
        <FormField
          label="End Date"
          type="date"
          value={formData.education?.postGraduation?.endDate || ''}
          onChange={(value) => onInputChange('education', 'postGraduation', { ...formData.education?.postGraduation, endDate: value })}
        />
        
        <FormField
          label="Status"
          type="select"
          options={['Completed', 'Pursuing', 'Dropped']}
          value={formData.education?.postGraduation?.status || ''}
          onChange={(value) => onInputChange('education', 'postGraduation', { ...formData.education?.postGraduation, status: value })}
        />
        
        <FormField
          label="Overall Grade/CGPA"
          type="text"
          value={formData.education?.postGraduation?.overallGrade || ''}
          onChange={(value) => onInputChange('education', 'postGraduation', { ...formData.education?.postGraduation, overallGrade: value })}
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
{/* 
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-800">
          <GraduationCap className="h-5 w-5" />
          <span className="font-medium">Education Progress</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          Complete all relevant education sections. Post-graduation is optional.
        </p>
      </div> */}
    </div>
  );
};

export default EducationStep;