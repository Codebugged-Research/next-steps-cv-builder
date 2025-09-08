import React from 'react';
import { Plus } from 'lucide-react';
import FormField from '../forms/FormField';
import FormGrid from '../forms/FormGrid';

const ConferencesStep = ({ formData, onArrayAdd, onArrayRemove, onArrayUpdate }) => {
  const newConference = { 
    name: '', 
    year: '', 
    role: '', 
    description: '', 
    certificateAwarded: false 
  };

  const renderConference = (conference, index) => (
    <div className="border border-gray-200 rounded-lg p-6 mb-4">
      <FormGrid>
        <FormField
          label="Conference Name"
          value={conference.name}
          onChange={(value) => onArrayUpdate('conferences', index, 'name', value)}
        />
        
        <FormField
          label="Year"
          value={conference.year}
          onChange={(value) => onArrayUpdate('conferences', index, 'year', value)}
        />
      </FormGrid>
      
      <div className="mt-4">
        <FormField
          label="Role"
          value={conference.role}
          placeholder="e.g., Presenter, Attendee"
          onChange={(value) => onArrayUpdate('conferences', index, 'role', value)}
        />
      </div>
      
      <div className="mt-4">
        <FormField
          label="Description"
          type="textarea"
          value={conference.description}
          placeholder="Describe your participation and contributions"
          rows={4}
          onChange={(value) => onArrayUpdate('conferences', index, 'description', value)}
        />
      </div>
      
      <div className="mt-4 flex items-center gap-3">
        <input
          type="checkbox"
          id={`certificate-${index}`}
          checked={conference.certificateAwarded || false}
          onChange={(e) => onArrayUpdate('conferences', index, 'certificateAwarded', e.target.checked)}
          className="text-[#169AB4] focus:ring-[#169AB4]"
        />
        <label htmlFor={`certificate-${index}`} className="text-sm font-medium text-gray-700">
          Certificate Awarded
        </label>
      </div>
      
      <button
        type="button"
        onClick={() => onArrayRemove('conferences', index)}
        className="text-red-600 hover:text-red-800 text-sm mt-4"
      >
        Remove Conference
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#04445E]">Conferences</h2>
        <button
          onClick={() => onArrayAdd('conferences', newConference)}
          className="flex items-center gap-2 px-4 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Conference
        </button>
      </div>

      <div className="space-y-4">
        {formData.conferences.map((conference, index) => (
          <div key={index}>
            {renderConference(conference, index)}
          </div>
        ))}
        
        {formData.conferences.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No conferences added yet</p>
            <p className="text-sm">Click "Add Conference" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConferencesStep;