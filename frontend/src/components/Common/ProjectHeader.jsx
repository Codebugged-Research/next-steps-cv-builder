import React from 'react';

const ProjectHeader = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  stats = [] 
}) => {
  return (
    <div className="bg-gradient-to-r from-[#04445E] to-[#169AB4] rounded-xl p-8 text-white mb-8">
      <div className="flex items-center gap-4 mb-6">
        <Icon className="h-12 w-12" />
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-white/90">{subtitle}</p>
        </div>
      </div>
      
      {stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectHeader;