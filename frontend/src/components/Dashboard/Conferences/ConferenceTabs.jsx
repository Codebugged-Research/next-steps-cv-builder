import React, { useState } from 'react';

import UpcomingConferencesTab from './UpcomingConferences';
import MyRegistrationsTab from './MyRegistrationsTab';
const ConferenceTabs = ({ upcomingConferences, registrations }) => {
    const [activeTab, setActiveTab] = useState('upcoming');

    return (
        <div className="bg-white rounded-xl shadow-lg">
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'upcoming'
                                ? 'border-[#169AB4] text-[#169AB4]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Upcoming Conferences ({upcomingConferences.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('registrations')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'registrations'
                                ? 'border-[#169AB4] text-[#169AB4]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        My Registrations ({registrations.length})
                    </button>
                </nav>
            </div>

            <div className="p-6">
                {activeTab === 'upcoming' && (
                    <UpcomingConferencesTab conferences={upcomingConferences} />
                )}
                {activeTab === 'registrations' && (
                    <MyRegistrationsTab registrations={registrations} />
                )}
            </div>
        </div>
    );
};

export default ConferenceTabs;