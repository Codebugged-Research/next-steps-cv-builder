import React, { useState } from 'react';
import FormField from '../forms/FormField';
import FormGrid from '../forms/FormGrid';
import { Upload, X, FileText, AlertCircle, Award, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../../../services/api';
import { FILE_CONSTRAINTS } from '../../../../constants/formConstants';
import { validateFile } from '../../../../utils/validationRules';

const USMLEScoresStep = ({ formData, onInputChange }) => {
  const [step1CertPreview, setStep1CertPreview] = useState(null);
  const [step2CertPreview, setStep2CertPreview] = useState(null);
  const [uploading, setUploading] = useState({
    step1Cert: false,
    step2Cert: false
  });
  const [errors, setErrors] = useState({});

  const handleCertificateUpload = async (e, certificateType) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateFile(file, 'DOCUMENT');
    if (error) {
      setErrors(prev => ({ ...prev, [certificateType]: error }));
      return;
    }

    try {
      setUploading(prev => ({ ...prev, [certificateType]: true }));

      const formDataObj = new FormData();
      formDataObj.append('certificate', file);

      const response = await api.post('/usmle/certificates/upload', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const certificateData = {
          url: response.data.data.url,
          key: response.data.data.key,
          fileName: file.name,
          uploadDate: new Date().toISOString()
        };

        if (certificateType === 'step1Cert') {
          setStep1CertPreview({
            name: file.name,
            url: response.data.data.url
          });
        } else {
          setStep2CertPreview({
            name: file.name,
            url: response.data.data.url
          });
        }

        onInputChange('usmleScores', certificateType, certificateData);
        setErrors(prev => ({ ...prev, [certificateType]: '' }));
        toast.success(`${certificateType === 'step1Cert' ? 'Step 1' : 'Step 2 CK'} certificate uploaded successfully!`);
      }
    } catch (error) {
      console.error(`${certificateType} upload error:`, error);
      toast.error(error.response?.data?.message || `Failed to upload ${certificateType === 'step1Cert' ? 'Step 1' : 'Step 2 CK'} certificate`);
    } finally {
      setUploading(prev => ({ ...prev, [certificateType]: false }));
    }
  };

  const removeCertificate = (certificateType) => {
    if (certificateType === 'step1Cert') {
      setStep1CertPreview(null);
    } else {
      setStep2CertPreview(null);
    }
    onInputChange('usmleScores', certificateType, null);
  };

  const CertificateUploadCard = ({ 
    title, 
    certificateType, 
    preview, 
    isUploading, 
    error,
    showUpload = true
  }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-700 mb-3">
        {title} <span className="text-xs text-gray-500">(Optional)</span>
      </h4>
      
      {showUpload && !preview && (
        <div>
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            {isUploading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#169AB4] mx-auto mb-2"></div>
                <span className="text-xs text-gray-500">Uploading...</span>
              </div>
            ) : (
              <>
                <Upload className="h-6 w-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500 text-center">Upload Certificate</span>
              </>
            )}
            <input
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleCertificateUpload(e, certificateType)}
              disabled={isUploading}
            />
          </label>
          {error && (
            <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {error}
            </p>
          )}
        </div>
      )}

      {preview && (
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-900 truncate">{preview.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={preview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#169AB4] hover:text-[#147a8f] underline"
              >
                View
              </a>
              <button
                onClick={() => removeCertificate(certificateType)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
                title="Remove Certificate"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="mt-2 text-xs text-gray-500">
        Accepted: PDF, JPG, PNG. Max: 5MB
      </p>
    </div>
  );

  const showStep1Upload = formData.usmleScores?.step1Status === 'pass';
  const showStep2Upload = formData.usmleScores?.step2ckScore && formData.usmleScores.step2ckScore.trim() !== '';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#04445E] mb-6">USMLE Scores</h2>
      
      <FormGrid>
        <div className="space-y-3">
          <FormField
            label="Step 1 Status"
            type="select"
            value={formData.usmleScores?.step1Status || ''}
            onChange={(value) => onInputChange('usmleScores', 'step1Status', value)}
            options={[
              { value: '', label: 'Select Status' },
              { value: 'not-taken', label: 'Not Taken' },
              { value: 'pass', label: 'Pass' },
              { value: 'fail', label: 'Fail' }
            ]}
          />
          
          {showStep1Upload && (
            <CertificateUploadCard
              title="Pass Certificate"
              certificateType="step1Cert"
              preview={step1CertPreview}
              isUploading={uploading.step1Cert}
              error={errors.step1Cert}
              showUpload={true}
            />
          )}
        </div>
        
        <div className="space-y-3">
          <FormField
            label="Step 2 CK Score"
            type="text"
            value={formData.usmleScores?.step2ckScore || ''}
            onChange={(value) => onInputChange('usmleScores', 'step2ckScore', value)}
            placeholder="Enter your Step 2 CK score"
          />
          
          {showStep2Upload && (
            <CertificateUploadCard
              title="CK Score Certificate"
              certificateType="step2Cert"
              preview={step2CertPreview}
              isUploading={uploading.step2Cert}
              error={errors.step2Cert}
              showUpload={true}
            />
          )}
        </div>
      </FormGrid>

      <div className="space-y-4">
        <FormField
          label="Step 2 CS Status"
          type="select"
          value={formData.usmleScores?.step2csStatus || ''}
          onChange={(value) => onInputChange('usmleScores', 'step2csStatus', value)}
          options={[
            { value: '', label: 'Select Status' },
            { value: 'not-taken', label: 'Not Taken' },
            { value: 'pass', label: 'Pass' },
            { value: 'fail', label: 'Fail' },
            { value: 'waived', label: 'Waived (Pathway)' }
          ]}
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <FormField
          label="ECFMG Certified"
          type="checkbox"
          value={formData.usmleScores?.ecfmgCertified || false}
          onChange={(value) => onInputChange('usmleScores', 'ecfmgCertified', value)}
        />
        
        <p className="text-sm text-gray-600 mt-2 ml-6">
          Check this box if you have received your ECFMG certification
        </p>
      </div>
    </div>
  );
};

export default USMLEScoresStep;