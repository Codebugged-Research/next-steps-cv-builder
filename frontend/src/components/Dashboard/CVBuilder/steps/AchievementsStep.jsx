import React, { useState } from 'react';
import FormField from '../forms/FormField';
import { Plus, X, Link, Upload } from 'lucide-react';

const AchievementsStep = ({ formData, onInputChange, onArrayAdd, onArrayRemove, onArrayUpdate }) => {
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    date: '',
    url: '',
    attachmentType: 'none' // 'none', 'url', 'file'
  });

  const handleAddAchievement = () => {
    if (newAchievement.title.trim()) {
      onArrayAdd('achievements', { ...newAchievement, id: Date.now() });
      setNewAchievement({
        title: '',
        description: '',
        date: '',
        url: '',
        attachmentType: 'none'
      });
    }
  };

  const handleRemoveAchievement = (index) => {
    onArrayRemove('achievements', index);
  };

  const handleUpdateAchievement = (index, field, value) => {
    onArrayUpdate('achievements', index, field, value);
  };

  const achievements = formData.achievements || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#04445E] mb-6">Significant Achievements</h2>
      
      {/* General Achievements Text Area */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <FormField
          label="General Achievements Summary"
          type="textarea"
          value={formData.significantAchievements || ''}
          onChange={(value) => onInputChange('significantAchievements', '', value)}
          placeholder="Provide a general overview of your achievements, awards, honors, etc."
          rows={4}
        />
      </div>

      {/* Individual Achievements with Attachments */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#04445E]">Detailed Achievements</h3>
        
        {/* Existing Achievements */}
        {achievements.map((achievement, index) => (
          <div key={achievement.id || index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium text-[#04445E]">{achievement.title}</h4>
              <button
                onClick={() => handleRemoveAchievement(index)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                label="Achievement Title"
                value={achievement.title}
                onChange={(value) => handleUpdateAchievement(index, 'title', value)}
                placeholder="e.g., Dean's List, Research Award"
              />
              
              <FormField
                label="Date Received"
                type="date"
                value={achievement.date}
                onChange={(value) => handleUpdateAchievement(index, 'date', value)}
              />
            </div>
            
            <FormField
              label="Description"
              type="textarea"
              value={achievement.description}
              onChange={(value) => handleUpdateAchievement(index, 'description', value)}
              placeholder="Brief description of the achievement"
              rows={2}
            />
            
            {/* Attachment Options */}
            <div className="mt-4 space-y-3">
              <label className="text-sm font-medium text-gray-700">Supporting Evidence</label>
              
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`attachment-${index}`}
                    value="none"
                    checked={achievement.attachmentType === 'none'}
                    onChange={() => handleUpdateAchievement(index, 'attachmentType', 'none')}
                    className="mr-2"
                  />
                  None
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`attachment-${index}`}
                    value="url"
                    checked={achievement.attachmentType === 'url'}
                    onChange={() => handleUpdateAchievement(index, 'attachmentType', 'url')}
                    className="mr-2"
                  />
                  <Link className="h-4 w-4 mr-1" />
                  URL/Link
                </label>
              </div>
              
              {achievement.attachmentType === 'url' && (
                <FormField
                  label="URL/Drive Link"
                  value={achievement.url || ''}
                  onChange={(value) => handleUpdateAchievement(index, 'url', value)}
                  placeholder="https://drive.google.com/... or any supporting URL"
                />
              )}
            </div>
          </div>
        ))}
        
        {/* Add New Achievement */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-[#04445E] mb-4">Add New Achievement</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              label="Achievement Title"
              value={newAchievement.title}
              onChange={(value) => setNewAchievement(prev => ({ ...prev, title: value }))}
              placeholder="e.g., Dean's List, Research Award"
            />
            
            <FormField
              label="Date Received"
              type="date"
              value={newAchievement.date}
              onChange={(value) => setNewAchievement(prev => ({ ...prev, date: value }))}
            />
          </div>
          
          <FormField
            label="Description"
            type="textarea"
            value={newAchievement.description}
            onChange={(value) => setNewAchievement(prev => ({ ...prev, description: value }))}
            placeholder="Brief description of the achievement"
            rows={2}
          />
          
          {/* Attachment Options for New Achievement */}
          <div className="mt-4 space-y-3">
            <label className="text-sm font-medium text-gray-700">Supporting Evidence</label>
            
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="new-attachment"
                  value="none"
                  checked={newAchievement.attachmentType === 'none'}
                  onChange={() => setNewAchievement(prev => ({ ...prev, attachmentType: 'none', url: '' }))}
                  className="mr-2"
                />
                None
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="new-attachment"
                  value="url"
                  checked={newAchievement.attachmentType === 'url'}
                  onChange={() => setNewAchievement(prev => ({ ...prev, attachmentType: 'url' }))}
                  className="mr-2"
                />
                <Link className="h-4 w-4 mr-1" />
                URL/Link
              </label>
            </div>
            
            {newAchievement.attachmentType === 'url' && (
              <FormField
                label="URL/Drive Link"
                value={newAchievement.url}
                onChange={(value) => setNewAchievement(prev => ({ ...prev, url: value }))}
                placeholder="https://drive.google.com/... or any supporting URL"
              />
            )}
          </div>
          
          <button
            onClick={handleAddAchievement}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Achievement
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementsStep;