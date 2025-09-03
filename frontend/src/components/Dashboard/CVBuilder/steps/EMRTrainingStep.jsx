import FormField from '../forms/FormField';

const EMRTrainingStep = ({ formData, onInputChange }) => {
  const emrSystems = ['Epic', 'Cerner', 'Allscripts', 'eClinicalWorks', 'NextGen', 'Other'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#04445E] mb-6">EMR & RCM Training</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">EMR Systems Experience</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {emrSystems.map((system) => (
            <label key={system} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.emrRcmTraining.emrSystems.includes(system)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...formData.emrRcmTraining.emrSystems, system]
                    : formData.emrRcmTraining.emrSystems.filter(s => s !== system);
                  onInputChange('emrRcmTraining', 'emrSystems', updated);
                }}
                className="text-[#169AB4] focus:ring-[#169AB4]"
              />
              <span className="text-sm">{system}</span>
            </label>
          ))}
        </div>
      </div>

      <FormField
        label="Revenue Cycle Management (RCM) Training"
        type="checkbox"
        value={formData.emrRcmTraining.rcmTraining}
        onChange={(value) => onInputChange('emrRcmTraining', 'rcmTraining', value)}
      />

      {formData.emrRcmTraining.rcmTraining && (
        <FormField
          label="Training Duration"
          value={formData.emrRcmTraining.duration}
          onChange={(value) => onInputChange('emrRcmTraining', 'duration', value)}
          placeholder="e.g., 3 months, 6 weeks"
        />
      )}
    </div>
  );
};

export default EMRTrainingStep;