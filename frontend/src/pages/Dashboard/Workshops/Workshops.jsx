import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const WorkshopsComponent = () => {
  const [activeTab, setActiveTab] = useState('acls');

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('acls')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'acls'
              ? 'border-[#169AB4] text-[#169AB4]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
        ACLS Training
        </button>
        <button
          onClick={() => setActiveTab('bcls')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'bcls'
              ? 'border-[#169AB4] text-[#169AB4]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          BCLS Training
        </button>
      </div>

      {activeTab === 'acls' && (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold mb-2">ACLS Training</h3>
          <p>Training sessions coming this December 2025</p>
        </div>
      )}

      {activeTab === 'bcls' && (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold mb-2">BCLS Training</h3>
          <p>Training sessions coming this December 2025</p>
        </div>
      )}
    </div>
  );
};

export default WorkshopsComponent;