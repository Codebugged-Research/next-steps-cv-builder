import React, { useState } from 'react';
import FormField from '../forms/FormField';
import FormGrid from '../forms/FormGrid';
import { Upload, X, User, Plus, Trash2, AlertCircle } from 'lucide-react';
import {
  GENDER_OPTIONS,
  LANGUAGE_OPTIONS,
  FLUENCY_OPTIONS,
  FILE_CONSTRAINTS
} from '../../../../constants/formConstants';
import {
  validateField,
  validateFile,
  validateLanguage,
  validateFormSection
} from '../../../../utils/validationRules';

const BasicDetailsStep = ({ formData, onInputChange }) => {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const languages = formData.basicDetails.languages || [];

  const handleInputChange = (field, value) => {
    // Update the form data
    onInputChange('basicDetails', field, value);

    // Mark field as touched
    setTouched(prev => ({ ...prev, [field]: true }));

    // Validate field
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const value = formData.basicDetails[field];
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const error = validateFile(file, 'PHOTO');
    if (error) {
      setErrors(prev => ({ ...prev, photo: error }));
      return;
    }

    try {
      setUploading(true);

      // Create preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to S3
      const formData = new FormData();
      formData.append('photo', file);

      const response = await api.post('/photos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Save the S3 URL to the CV data
        onInputChange('basicDetails', 'photo', response.data.data.url);
        onInputChange('basicDetails', 'photoKey', response.data.data.key);
        setErrors(prev => ({ ...prev, photo: '' }));
        toast.success('Photo uploaded successfully!');
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload photo');
      setPhotoPreview(null);
    } finally {
      setUploading(false);
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

    // Validate the specific language entry
    const langErrors = validateLanguage(newLanguages[index]);
    setErrors(prev => ({
      ...prev,
      [`language_${index}`]: langErrors
    }));
  };

  const removeLanguage = (index) => {
    const newLanguages = languages.filter((_, i) => i !== index);
    onInputChange('basicDetails', 'languages', newLanguages);

    // Remove errors for this language
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`language_${index}`];
      return newErrors;
    });
  };

  const getFieldError = (field) => {
    return touched[field] && errors[field] ? errors[field] : '';
  };

  const isFieldValid = (field) => {
    return touched[field] && !errors[field] && formData.basicDetails[field];
  };

  const getLanguageError = (index, field) => {
    return errors[`language_${index}`] && errors[`language_${index}`][field]
      ? errors[`language_${index}`][field]
      : '';
  };

  // Get validation status for entire section
  const getSectionValidation = () => {
    const sectionErrors = validateFormSection('basicDetails', formData.basicDetails);
    return {
      isValid: Object.keys(sectionErrors).length === 0,
      errors: sectionErrors
    };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#04445E] mb-6">Basic Details</h2>

      <FormGrid>
        <div className="relative">
          <FormField
            label="Full Name"
            type="text"
            value={formData.basicDetails.fullName || ''}
            onChange={(value) => handleInputChange('fullName', value)}
            onBlur={() => handleBlur('fullName')}
            required
            error={getFieldError('fullName')}
            className={`${getFieldError('fullName') ? 'border-red-500' : isFieldValid('fullName') ? 'border-green-500' : ''}`}
          />
          {isFieldValid('fullName') && (
            <div className="absolute right-3 top-8 text-green-500">✓</div>
          )}
        </div>

        <div className="relative">
          <FormField
            label="Email"
            type="email"
            value={formData.basicDetails.email || ''}
            onChange={(value) => handleInputChange('email', value)}
            onBlur={() => handleBlur('email')}
            required
            error={getFieldError('email')}
            className={`${getFieldError('email') ? 'border-red-500' : isFieldValid('email') ? 'border-green-500' : ''}`}
          />
          {isFieldValid('email') && (
            <div className="absolute right-3 top-8 text-green-500">✓</div>
          )}
        </div>

        <div className="relative">
          <FormField
            label="Phone"
            type="tel"
            value={formData.basicDetails.phone || ''}
            onChange={(value) => handleInputChange('phone', value)}
            onBlur={() => handleBlur('phone')}
            required
            error={getFieldError('phone')}
            className={`${getFieldError('phone') ? 'border-red-500' : isFieldValid('phone') ? 'border-green-500' : ''}`}
          />
          {isFieldValid('phone') && (
            <div className="absolute right-3 top-8 text-green-500">✓</div>
          )}
        </div>

        <FormField
          label="Gender"
          type="select"
          options={GENDER_OPTIONS}
          value={formData.basicDetails.gender || ''}
          onChange={(value) => handleInputChange('gender', value)}
        />

        <FormField
          label="Nationality"
          type="text"
          value={formData.basicDetails.nationality || ''}
          onChange={(value) => handleInputChange('nationality', value)}
          onBlur={() => handleBlur('nationality')}
          error={getFieldError('nationality')}
        />

        <div className="relative">
          <FormField
            label="USMLE ID"
            type="text"
            value={formData.basicDetails.usmleId || ''}
            onChange={(value) => handleInputChange('usmleId', value.toUpperCase())}
            onBlur={() => handleBlur('usmleId')}
            placeholder="Enter your USMLE ID"
            error={getFieldError('usmleId')}
            className={`${getFieldError('usmleId') ? 'border-red-500' : isFieldValid('usmleId') ? 'border-green-500' : ''}`}
          />
        </div>
      </FormGrid>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#04445E]">Address</h3>
        <FormField
          label="Address"
          type="textarea"
          value={formData.basicDetails.address || ''}
          onChange={(value) => handleInputChange('address', value)}
          onBlur={() => handleBlur('address')}
          placeholder="Enter your complete address"
          rows={3}
          error={getFieldError('address')}
        />
      </div>

      <FormGrid>
        <div className="relative">
          <FormField
            label="Medical School"
            type="text"
            value={formData.basicDetails.medicalSchool || ''}
            onChange={(value) => handleInputChange('medicalSchool', value)}
            onBlur={() => handleBlur('medicalSchool')}
            required
            error={getFieldError('medicalSchool')}
            className={`${getFieldError('medicalSchool') ? 'border-red-500' : isFieldValid('medicalSchool') ? 'border-green-500' : ''}`}
          />
          {isFieldValid('medicalSchool') && (
            <div className="absolute right-3 top-8 text-green-500">✓</div>
          )}
        </div>

        <div className="relative">
          <FormField
            label="Graduation Year"
            type="number"
            value={formData.basicDetails.graduationYear || ''}
            onChange={(value) => handleInputChange('graduationYear', value)}
            onBlur={() => handleBlur('graduationYear')}
            min="1990"
            max={new Date().getFullYear() + 10}
            required
            error={getFieldError('graduationYear')}
            className={`${getFieldError('graduationYear') ? 'border-red-500' : isFieldValid('graduationYear') ? 'border-green-500' : ''}`}
          />
          {isFieldValid('graduationYear') && (
            <div className="absolute right-3 top-8 text-green-500">✓</div>
          )}
        </div>

        <div className="relative">
          <FormField
            label="MBBS Registration No."
            type="text"
            value={formData.basicDetails.mbbsRegNo || ''}
            onChange={(value) => handleInputChange('mbbsRegNo', value.toUpperCase())}
            onBlur={() => handleBlur('mbbsRegNo')}
            placeholder="Enter your MBBS registration number"
            error={getFieldError('mbbsRegNo')}
            className={`${getFieldError('mbbsRegNo') ? 'border-red-500' : isFieldValid('mbbsRegNo') ? 'border-green-500' : ''}`}
          />
        </div>

        <div className="relative">
          <FormField
            label="City"
            type="text"
            value={formData.basicDetails.city || ''}
            onChange={(value) => handleInputChange('city', value)}
            onBlur={() => handleBlur('city')}
            required
            error={getFieldError('city')}
            className={`${getFieldError('city') ? 'border-red-500' : isFieldValid('city') ? 'border-green-500' : ''}`}
          />
          {isFieldValid('city') && (
            <div className="absolute right-3 top-8 text-green-500">✓</div>
          )}
        </div>
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
                      Language <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={lang.language}
                      onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent ${getLanguageError(index, 'language') ? 'border-red-300' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Select Language</option>
                      {LANGUAGE_OPTIONS.map(language => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </select>
                    {getLanguageError(index, 'language') && (
                      <p className="mt-1 text-sm text-red-600">{getLanguageError(index, 'language')}</p>
                    )}
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fluency Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={lang.fluency}
                      onChange={(e) => updateLanguage(index, 'fluency', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent ${getLanguageError(index, 'fluency') ? 'border-red-300' : 'border-gray-300'
                        }`}
                    >
                      {FLUENCY_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {getLanguageError(index, 'fluency') && (
                      <p className="mt-1 text-sm text-red-600">{getLanguageError(index, 'fluency')}</p>
                    )}
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
          <div>
            <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 text-center">Upload Photo</span>
              <input
                type="file"
                className="hidden"
                accept={FILE_CONSTRAINTS.PHOTO.ACCEPTED_EXTENSIONS}
                onChange={handlePhotoUpload}
              />
            </label>
            {errors.photo && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.photo}
              </p>
            )}
          </div>
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
        <p className="mt-2 text-sm text-gray-500">
          Accepted formats: {FILE_CONSTRAINTS.PHOTO.ACCEPTED_EXTENSIONS}. Maximum size: {FILE_CONSTRAINTS.PHOTO.MAX_SIZE / (1024 * 1024)}MB
        </p>
      </div>

      {/* Section Validation Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-800">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Section Status</span>
        </div>
        <p className="text-blue-700 text-sm mt-1">
          {getSectionValidation().isValid
            ? "All required fields are completed and valid!"
            : "Please complete all required fields to proceed."
          }
        </p>
      </div>
    </div>
  );
};

export default BasicDetailsStep;