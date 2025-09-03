import React, { useState } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import ProjectHeader from '../../Common/ProjectHeader';
import ConferenceTabs from './ConferenceTabs';

const CaseReports = ({ onBack }) => {
    const [upcomingConferences] = useState([
        {
            id: 1,
            title: 'International Medical Conference 2025',
            category: 'Internal Medicine',
            price: 299,
            description: 'Join leading medical professionals from around the world for cutting-edge research presentations, networking opportunities, and continuing education.',
            date: 'October 14-16, 2025',
            location: 'New York Convention Center, NY',
            format: 'Hybrid',
            activeSlots: { current: 50, total: 50 },
            passiveSlots: { current: 450, total: 450 },
            deadline: '30/09/2025'
        },
    ]);
    const [registrations] = useState([]);
    const headerConfig = {
        icon: BookOpen,
        title: 'Conferences & Events',
        subtitle: 'Find below the list of upcoming conferences and events',
        stats: [
            { value: '8', label: 'Available Conferences' },
            { value: '5', label: 'Your Registration' },
        ]
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-[#169AB4] hover:text-[#147a8f] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button> */}

                <ProjectHeader {...headerConfig} />
                <ConferenceTabs
                    upcomingConferences={upcomingConferences}
                    registrations={registrations}
                />
            </div>
        </div>
    );
};

export default CaseReports;