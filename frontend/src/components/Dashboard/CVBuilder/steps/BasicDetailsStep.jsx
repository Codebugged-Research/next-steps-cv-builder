import React, { useState } from 'react';
import FormField from '../forms/FormField';
import FormGrid from '../forms/FormGrid';
import { Upload, X, User, Plus, Trash2 } from 'lucide-react';

const BasicDetailsStep = ({ formData, onInputChange }) => {
  const [photoPreview, setPhotoPreview] = useState(null);

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const languageOptions = [
    'English',
    'Hindi',
    'Spanish',
    'French',
    'German',
    'Mandarin',
    'Arabic',
    'Portuguese',
    'Russian',
    'Japanese'
  ];

  const fluencyOptions = [
    { value: '', label: 'Select Fluency' },
    { value: 'native', label: 'Native' },
    { value: 'fluent', label: 'Fluent' },
    { value: 'conversational', label: 'Conversational' },
    { value: 'basic', label: 'Basic' },
    { value: 'beginner', label: 'Beginner' }
  ];

  const languages = formData.basicDetails.languages || [];

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        onInputChange('basicDetails', 'photo', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    onInputChange('basicDetails', 'photo', null);
  };

  const addLanguage = () => {
    const newLanguages = [...languages, { language: '', fluency: '' }];
    onInputChange('basicDetails', 'languages', newLanguages);
  };

  const updateLanguage = (index, field, value) => {
    const newLanguages = languages.map((lang, i) => 
      i === index ? { ...lang, [field]: value } : lang
    );
    onInputChange('basicDetails', 'languages', newLanguages);
  };

  const removeLanguage = (index) => {
    const newLanguages = languages.filter((_, i) => i !== index);
    onInputChange('basicDetails', 'languages', newLanguages);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#04445E] mb-6">Basic Details</h2>
      <FormGrid>
        <FormField
          label="Full Name"
          type="text"
          value={formData.basicDetails.fullName || ''}
          onChange={(value) => onInputChange('basicDetails', 'fullName', value)}
          required
        />
        
        <FormField
          label="Email"
          type="email"
          value={formData.basicDetails.email || ''}
          onChange={(value) => onInputChange('basicDetails', 'email', value)}
          required
        />
        
        <FormField
          label="Phone"
          type="tel"
          value={formData.basicDetails.phone || ''}
          onChange={(value) => onInputChange('basicDetails', 'phone', value)}
          required
        />

        <FormField
          label="Gender"
          type="select"
          options={genderOptions}
          value={formData.basicDetails.gender || ''}
          onChange={(value) => onInputChange('basicDetails', 'gender', value)}
        />

        <FormField
          label="Nationality"
          type="text"
          value={formData.basicDetails.nationality || ''}
          onChange={(value) => onInputChange('basicDetails', 'nationality', value)}
        />

        <FormField
          label="USMLE ID"
          type="text"
          value={formData.basicDetails.usmleId || ''}
          onChange={(value) => onInputChange('basicDetails', 'usmleId', value)}
          placeholder="Enter your USMLE ID"
        />
      </FormGrid>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#04445E]">Address</h3>
        <FormField
          label="Address"
          type="textarea"
          value={formData.basicDetails.address || ''}
          onChange={(value) => onInputChange('basicDetails', 'address', value)}
          placeholder="Enter your complete address"
          rows={3}
        />
      </div>

      <FormGrid>
        <FormField
          label="Medical School"
          type="text"
          value={formData.basicDetails.medicalSchool || ''}
          onChange={(value) => onInputChange('basicDetails', 'medicalSchool', value)}
          required
        />
        
        <FormField
          label="Graduation Year"
          type="number"
          value={formData.basicDetails.graduationYear || ''}
          onChange={(value) => onInputChange('basicDetails', 'graduationYear', value)}
          min="1990"
          max={new Date().getFullYear() + 10}
        />

        <FormField
          label="MBBS Registration No."
          type="text"
          value={formData.basicDetails.mbbsRegNo || ''}
          onChange={(value) => onInputChange('basicDetails', 'mbbsRegNo', value)}
          placeholder="Enter your MBBS registration number"
        />

        <FormField
          label="City"
          type="text"
          value={formData.basicDetails.city || ''}
          onChange={(value) => onInputChange('basicDetails', 'city', value)}
        />
      </FormGrid>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#04445E]">Languages & Fluency</h3>
          <button
            onClick={addLanguage}
            className="flex items-center gap-2 px-4 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Language
          </button>
        </div>

        {languages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No languages added yet. Click "Add Language" to start.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {languages.map((lang, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      value={lang.language}
                      onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
                    >
                      <option value="">Select Language</option>
                      {languageOptions.map(language => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fluency Level
                    </label>
                    <select
                      value={lang.fluency}
                      onChange={(e) => updateLanguage(index, 'fluency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
                    >
                      {fluencyOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={() => removeLanguage(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove Language"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#04445E] mb-4">Profile Photo</h3>
        
        {!photoPreview ? (
          <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500 text-center">Upload Photo</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </label>
        ) : (
          <div className="relative w-32 h-32">
            <img
              src={photoPreview}
              alt="Profile Preview"
              className="w-32 h-32 rounded-lg object-cover"
            />
            <button
              onClick={removePhoto}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default BasicDetailsStep;