import React from 'react';

const FormField = ({ label, type = 'text', value, onChange, placeholder, options, rows }) => {
  const baseClasses = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#169AB4] focus:border-transparent";

  const handleChange = (e) => {
    const newValue = type === 'checkbox' ? e.target.checked : e.target.value;
    onChange(newValue);
  };

  if (type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <textarea
          value={value || ''}
          onChange={handleChange}
          rows={rows || 6}
          placeholder={placeholder}
          className={baseClasses}
        />
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <select
          value={value || ''}
          onChange={handleChange}
          className={baseClasses}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id={label}
          checked={value || false}
          onChange={handleChange}
          className="text-[#169AB4] focus:ring-[#169AB4]"
        />
        <label htmlFor={label} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        className={baseClasses}
      />
    </div>
  );
};

export default FormField;