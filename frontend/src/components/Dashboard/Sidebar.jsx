import React from 'react';
import { User, FileText, BookOpen, Calendar, Heart, Award, ArrowRight } from 'lucide-react';
import NavigationItem from './NavigationItem';
import CVProgress from '../Dashboard/CVBuilder/CVProgress';
const Sidebar = ({ activeSection, onSectionChange, user }) => {
  const navigationItems = [
    { id: 'cv-builder', label: 'CV Builder', icon: FileText },
    { id: 'existing-cv', label: 'Upload Your CV', icon: FileText },
    { id: 'systematic-reviews', label: 'Systematic Reviews', icon: BookOpen },
    { id: 'case-reports', label: 'Case Reports', icon: FileText },
    { id: 'conferences', label: 'Conferences', icon: Calendar },
    { id: 'workshops', label: 'Workshops', icon: Heart },
    { id: 'emr-training', label: 'EMR & RCM Training', icon: Award },
  ];

  return (
    <div className="w-80 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-[#04445E] to-[#169AB4] rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[#04445E]">{user?.fullName || 'User'} </h3>
            <p className="text-sm text-gray-500 uppercase">{user?.medicalSchool}</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.id}
              {...item}
              isActive={activeSection === item.id}
              onClick={() => onSectionChange(item.id)}
              color={item.color}
            />
          ))}
        </nav>

      </div>
    </div>
  );
};

export default Sidebar;