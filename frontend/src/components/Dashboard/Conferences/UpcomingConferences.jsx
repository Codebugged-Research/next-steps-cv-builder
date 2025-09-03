import React from 'react';
import ConferenceCard from '../../Common/ConferenceCard';

const UpcomingConferencesTab = ({ conferences }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {conferences.map((conference) => (
        <ConferenceCard
          key={conference.id}
          conference={conference}
          onRegister={(id) => console.log('Register for conference:', id)}
        />
      ))}
    </div>
  );
};

export default UpcomingConferencesTab;
