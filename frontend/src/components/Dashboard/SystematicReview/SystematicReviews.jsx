import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Search, FileText, Edit, CheckCircle, Eye, Download, Users, Calendar, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectHeader from '../../Common/ProjectHeader';

const PublicationTimeline = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const stagesPerPage = 5;

  const timelineStages = [
    {
      id: 0,
      title: "Week 1",
      duration: "Month 1",
      icon: BookOpen,
      status: "completed",
      content: {
        overview: "Foundation of research methodology and article types",
        topics: [
          "Introduction to Research",
          "Types of Article's",
          "Purpose of Review Article",
          "Introduction to PICO Chart",
          "Purpose of PICO Chart"
        ],
        progress: 100
      }
    },
    {
      id: 1,
      title: "Week 2",
      duration: "Month 1",
      icon: Target,
      status: "completed",
      content: {
        overview: "Developing PICO framework and understanding publication process",
        topics: [
          "Framing a title using PICO Chart with examples",
          "Information about Publication Process",
          "Initiation for Review Article topics",
          "Information regarding Next Class"
        ],
        progress: 100
      }
    },
    {
      id: 2,
      title: "Week 3",
      duration: "Month 1",
      icon: Search,
      status: "in-progress",
      content: {
        overview: "Search strategy development and database navigation",
        topics: [
          "Introduction to Search Strategy",
          "Purpose of Search Strategy",
          "Introduction to Pubmed Database",
          "Search rules related to Pubmed Database"
        ],
        progress: 75
      }
    },
    {
      id: 3,
      title: "Week 4",
      duration: "Month 1",
      icon: FileText,
      status: "pending",
      content: {
        overview: "Case reports introduction and practical demonstrations",
        topics: [
          "Introduction to Case Reports",
          "Purpose of Case Reports",
          "Structure of Case Reports",
          "Few Examples",
          "Initiation for Case Report topics",
          "Examples through Demonstration"
        ],
        progress: 0
      }
    },
    {
      id: 4,
      title: "Week 5",
      duration: "Month 1",
      icon: Users,
      status: "pending",
      content: {
        overview: "Resource access and citation management tools",
        topics: [
          "How to Access Paper's using Paperpanda",
          "Discussion on Students' topics in relation with PICO Chart",
          "Introduction to Reference Citation Manager",
          "Demonstration of Mendeley Citation Manager",
          "Guidelines for Systematic Review Article"
        ],
        progress: 0
      }
    },
    {
      id: 5,
      title: "Week 6",
      duration: "Month 2",
      icon: CheckCircle,
      status: "pending",
      content: {
        overview: "Topic finalization and task distribution",
        topics: [
          "Finalize Review Article Topic",
          "Distribution of Tasks between Students",
          "Discussion on Case Report Topics"
        ],
        progress: 0
      }
    },
    {
      id: 6,
      title: "Week 7",
      duration: "Month 2",
      icon: Edit,
      status: "pending",
      content: {
        overview: "Case report finalization and comprehensive discussion",
        topics: [
          "Finalize Case Report Topic",
          "Distribution of Tasks between Students",
          "Discussion on both Review Article and Case Report"
        ],
        progress: 0
      }
    },
    {
      id: 7,
      title: "Week 8",
      duration: "Month 2",
      icon: Eye,
      status: "pending",
      content: {
        overview: "Progress monitoring and quality assurance",
        topics: [
          "RA & CR progress monitoring"
        ],
        progress: 0
      }
    },
    {
      id: 8,
      title: "Week 9-12",
      duration: "Month 3",
      icon: FileText,
      status: "pending",
      content: {
        overview: "Final draft preparation and submission",
        topics: [
          "Preparation & Submissions of final draft (Both RA & CR)"
        ],
        progress: 0
      }
    },
    {
      id: 9,
      title: "Week 13-16",
      duration: "Month 4",
      icon: CheckCircle,
      status: "pending",
      content: {
        overview: "Quality review and journal selection",
        topics: [
          "Proof reading plagiarism check grammar corrections selection of suitable journals"
        ],
        progress: 0
      }
    },
    {
      id: 10,
      title: "Week 17-20",
      duration: "Month 5",
      icon: Download,
      status: "pending",
      content: {
        overview: "Publication follow-up and final processing",
        topics: [
          "Publication status follow up",
          "Minor/Major revisions",
          "PDF Generation"
        ],
        progress: 0
      }
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-[#04445E]';
      case 'pending': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return '✓';
      case 'in-progress': return '◐';
      case 'pending': return '○';
      default: return '○';
    }
  };

  const totalPages = Math.ceil(timelineStages.length / stagesPerPage);
  const currentStages = timelineStages.slice(
    currentPage * stagesPerPage, 
    (currentPage + 1) * stagesPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      setActiveStage(currentPage * stagesPerPage + stagesPerPage);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setActiveStage((currentPage - 1) * stagesPerPage);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Publication Timeline</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-[#04445E] text-white hover:bg-[#033852]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages - 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-[#04445E] text-white hover:bg-[#033852]'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative px-8">
          <div className="absolute top-8 left-16 right-16 h-1 bg-gray-200 rounded"></div>
          <div 
            className="absolute top-8 left-16 h-1 bg-[#04445E] rounded transition-all duration-500"
            style={{ 
              width: `${(currentStages.findIndex(s => s.id === activeStage) + 1) / currentStages.length * (100 - (32/currentStages.length))}%` 
            }}
          ></div>

          <div className="flex justify-between relative">
            {currentStages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = stage.id === activeStage;
              const stageIndex = timelineStages.findIndex(s => s.id === stage.id);
              const isPast = stageIndex < timelineStages.findIndex(s => s.id === activeStage);
              
              return (
                <div key={stage.id} className="flex flex-col items-center min-w-0 flex-1">
                  <button
                    onClick={() => setActiveStage(stage.id)}
                    className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300 mb-3 ${
                      isActive 
                        ? 'border-[#04445E] bg-[#04445E] text-white shadow-lg scale-110' 
                        : isPast 
                        ? `border-green-500 ${getStatusColor(stage.status)} text-white`
                        : 'border-gray-300 bg-white text-gray-500 hover:border-[#04445E] hover:scale-105'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </button>
                  
                  <div className="text-center max-w-20">
                    <div className={`text-sm font-semibold mb-1 ${isActive ? 'text-[#04445E]' : 'text-gray-700'}`}>
                      {stage.title}
                    </div>
                    <div className={`text-xs mb-2 ${isActive ? 'text-[#04445E]' : 'text-gray-500'}`}>
                      {stage.duration}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                      stage.status === 'completed' ? 'bg-green-100 text-green-700' :
                      stage.status === 'in-progress' ? 'bg-blue-100 text-[#04445E]' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {getStatusIcon(stage.status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-6 border border-blue-100">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {timelineStages.find(s => s.id === activeStage)?.title}
            </h3>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-1 gap-6">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#04445E]" />
              Content
            </h4>
            <ul className="space-y-2">
              {timelineStages.find(s => s.id === activeStage)?.content.topics.map((topic, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-2 h-2 bg-[#04445E] rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const NextStepsProjects = () => {
  return (
    <div className="mb-8">
      <PublicationTimeline />
    </div>
  );
};

const SystematicReviews = ({ onBack }) => {
  const headerConfig = {
    icon: BookOpen,
    title: 'Publications',
    subtitle: 'Collaborate with peers and Next Steps team for publication-ready research',
    stats: [
      { value: '8', label: 'Project Stages' },
      { value: '5', label: 'Team Size' },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProjectHeader {...headerConfig} />
        <NextStepsProjects />
      </div>
    </div>
  );
};

export default SystematicReviews;