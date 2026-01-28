import React from 'react';
import { ArrowLeft, Download } from 'lucide-react';

const CVPreview = ({ cvData, onBack, onDownload }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-12 mb-8" id="cv-document">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#04445E] mb-4">
              {cvData?.basicDetails?.fullName || 'Your Name'}
            </h1>
            <div className="text-lg text-gray-600">
              {cvData?.basicDetails?.email || 'email@example.com'} | {cvData?.basicDetails?.phone || 'Phone Number'}
            </div>
            {cvData?.basicDetails?.city && (
              <div className="text-lg text-gray-600 mt-1">
                {cvData.basicDetails.city}
              </div>
            )}
          </div>

          {/* Education Section */}
          {(cvData?.education?.schooling?.schoolName || cvData?.education?.college?.collegeName ||
            cvData?.education?.graduation?.universityName || cvData?.education?.postGraduation?.universityName ||
            cvData?.education?.internship?.institution) && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#04445E] mb-6 border-b-2 border-gray-200 pb-2">
                  Education
                </h2>

                <div className="space-y-6">
                  {/* Post Graduation */}
                  {cvData.education?.postGraduation?.universityName && (
                    <div className="border-l-4 border-[#169AB4] pl-4">
                      <div className="font-semibold text-lg">{cvData.education.postGraduation.degree || 'Post Graduation'}</div>
                      <div className="text-gray-600">
                        {cvData.education.postGraduation.universityName}
                        {cvData.education.postGraduation.specialization && ` • ${cvData.education.postGraduation.specialization}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {[cvData.education.postGraduation.city, cvData.education.postGraduation.state, cvData.education.postGraduation.country].filter(Boolean).join(', ')}
                        {cvData.education.postGraduation.endDate && ` • ${cvData.education.postGraduation.endDate.split('-')[0]}`}
                      </div>
                    </div>
                  )}

                  {/* Graduation */}
                  {cvData.education?.graduation?.universityName && (
                    <div className="border-l-4 border-[#169AB4] pl-4">
                      <div className="font-semibold text-lg">{cvData.education.graduation.degree || 'Graduation'}</div>
                      <div className="text-gray-600">
                        {cvData.education.graduation.universityName}
                        {cvData.education.graduation.specialization && ` • ${cvData.education.graduation.specialization}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {[cvData.education.graduation.city, cvData.education.graduation.state, cvData.education.graduation.country].filter(Boolean).join(', ')}
                        {cvData.education.graduation.endDate && ` • ${cvData.education.graduation.endDate.split('-')[0]}`}
                      </div>
                    </div>
                  )}

                  {/* Internship */}
                  {cvData.education?.internship?.institution && (
                    <div className="border-l-4 border-[#169AB4] pl-4">
                      <div className="font-semibold text-lg">Internship</div>
                      <div className="text-gray-600">{cvData.education.internship.institution}</div>
                      <div className="text-sm text-gray-500">
                        {cvData.education.internship.city}
                        {(cvData.education.internship.startDate || cvData.education.internship.endDate) &&
                          ` • ${cvData.education.internship.startDate?.split('-')[0]} - ${cvData.education.internship.endDate?.split('-')[0]}`}
                      </div>
                    </div>
                  )}

                  {/* Higher Secondary */}
                  {cvData.education?.college?.collegeName && (
                    <div className="border-l-4 border-[#169AB4] pl-4">
                      <div className="font-semibold text-lg">Higher Secondary (+1 & +2)</div>
                      <div className="text-gray-600">
                        {cvData.education.college.collegeName}
                        {cvData.education.college.stream && ` • ${cvData.education.college.stream}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {[cvData.education.college.city, cvData.education.college.state].filter(Boolean).join(', ')}
                        {cvData.education.college.endYear && ` • ${cvData.education.college.endYear}`}
                      </div>
                    </div>
                  )}

                  {/* Secondary School */}
                  {cvData.education?.schooling?.schoolName && (
                    <div className="border-l-4 border-[#169AB4] pl-4">
                      <div className="font-semibold text-lg">Secondary School (10th)</div>
                      <div className="text-gray-600">{cvData.education.schooling.schoolName}</div>
                      <div className="text-sm text-gray-500">
                        {[cvData.education.schooling.city, cvData.education.schooling.state].filter(Boolean).join(', ')}
                        {cvData.education.schooling.endYear && ` • ${cvData.education.schooling.endYear}`}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* USMLE Scores */}
          {(cvData?.usmleScores?.step1Status !== 'not-taken' || cvData?.usmleScores?.step2ckScore || cvData?.usmleScores?.ecfmgCertified) && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#04445E] mb-6 border-b-2 border-gray-200 pb-2">
                USMLE Scores
              </h2>
              <div className="space-y-2">
                {cvData?.usmleScores?.step1Status !== 'not-taken' && (
                  <div><span className="font-medium">Step 1:</span> {cvData.usmleScores.step1Status}</div>
                )}
                {cvData?.usmleScores?.step2ckScore && (
                  <div><span className="font-medium">Step 2 CK:</span> {cvData.usmleScores.step2ckScore}</div>
                )}
                {cvData?.usmleScores?.ecfmgCertified && (
                  <div><span className="font-medium">ECFMG Certified:</span> Yes</div>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          {cvData?.skills && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#04445E] mb-6 border-b-2 border-gray-200 pb-2">
                Skills & Competencies
              </h2>
              <div className="text-gray-700 whitespace-pre-line">
                {typeof cvData.skills === 'string' ? cvData.skills : cvData.skills?.skillsList}
              </div>
            </div>
          )}

          {/* Publications */}
          {cvData?.publications && cvData.publications.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#04445E] mb-6 border-b-2 border-gray-200 pb-2">
                Publications
              </h2>
              <div className="space-y-4">
                {cvData.publications.map((pub, index) => (
                  <div key={index} className="border-l-4 border-[#169AB4] pl-4">
                    <div className="font-semibold">{pub.title}</div>
                    <div className="text-gray-600">{pub.journal} ({pub.year})</div>
                    <div className="text-sm text-gray-500 capitalize">{pub.type.replace('-', ' ')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conferences */}
          {cvData?.conferences && cvData.conferences.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#04445E] mb-6 border-b-2 border-gray-200 pb-2">
                Conferences Attended
              </h2>
              <div className="space-y-4">
                {cvData.conferences.map((conf, index) => (
                  <div key={index} className="border-l-4 border-[#169AB4] pl-4">
                    <div className="font-semibold">{conf.name}</div>
                    <div className="text-gray-600">
                      {conf.role} ({conf.year})
                      {conf.certificateAwarded && <span className="ml-2 text-green-600">• Certificate Awarded</span>}
                    </div>
                    {conf.description && (
                      <div className="text-gray-700 mt-1">{conf.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workshops */}
          {cvData?.workshops && cvData.workshops.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#04445E] mb-6 border-b-2 border-gray-200 pb-2">
                Workshops & Training
              </h2>
              <div className="space-y-4">
                {cvData.workshops.map((workshop, index) => (
                  <div key={index} className="border-l-4 border-[#169AB4] pl-4">
                    <div className="font-semibold text-lg">{workshop.name}</div>
                    <div className="text-gray-600">
                      {workshop.organizer && `${workshop.organizer} • `}
                      {workshop.year || workshop.date}
                    </div>
                    {(workshop.location || workshop.duration) && (
                      <div className="text-sm text-gray-500">
                        {[workshop.location, workshop.duration].filter(Boolean).join(' • ')}
                      </div>
                    )}
                    {workshop.description && (
                      <div className="text-gray-700 mt-2 text-sm whitespace-pre-line">{workshop.description}</div>
                    )}
                    {workshop.awards && (
                      <div className="text-green-600 mt-1 font-medium italic">Awards: {workshop.awards}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(cvData?.emrRcmTraining?.emrSystems?.length > 0 || cvData?.emrRcmTraining?.rcmTraining) && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#04445E] mb-6 border-b-2 border-gray-200 pb-2">
                EMR & RCM Training
              </h2>
              <div className="space-y-2">
                {cvData.emrRcmTraining.emrSystems.length > 0 && (
                  <div>
                    <span className="font-medium">EMR Systems:</span> {cvData.emrRcmTraining.emrSystems.join(', ')}
                  </div>
                )}
                {cvData.emrRcmTraining.rcmTraining && (
                  <div>
                    <span className="font-medium">RCM Training:</span> Completed
                    {cvData.emrRcmTraining.duration && ` (${cvData.emrRcmTraining.duration})`}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Experience Sections */}
          {[
            { title: 'US Clinical Experience', items: cvData?.usClinicalExperience?.list },
            { title: 'Clinical Experience', items: cvData?.clinicalExperiences },
            { title: 'Work Experience', items: cvData?.workExperience },
            { title: 'Professional Experience', items: cvData?.professionalExperiences },
            { title: 'Volunteer Experience', items: cvData?.volunteerExperiences }
          ].map((section, idx) => section.items && section.items.length > 0 && (
            <div key={idx} className="mb-10">
              <h2 className="text-2xl font-bold text-[#04445E] mb-6 border-b-2 border-gray-200 pb-2">
                {section.title}
              </h2>
              <div className="space-y-6">
                {section.items.map((exp, i) => (
                  <div key={i} className="border-l-4 border-[#169AB4] pl-4">
                    <div className="font-semibold text-lg">{exp.title || exp.position || exp.role}</div>
                    <div className="text-gray-600">
                      {exp.hospital || exp.organization || exp.institution}
                      {exp.location && ` • ${exp.location}`}
                    </div>
                    <div className="text-sm text-gray-500 italic">
                      {exp.duration || (exp.startDate && `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`)}
                    </div>
                    {exp.description && (
                      <div className="text-gray-700 mt-2 text-sm whitespace-pre-line">{exp.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Certifications (ACLS/BLS) */}
          {(cvData?.aclsBls?.aclsCertified || cvData?.aclsBls?.blsCertified) && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#04445E] mb-6 border-b-2 border-gray-200 pb-2">
                Certifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cvData.aclsBls.aclsCertified && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="font-bold text-[#169AB4]">ACLS Certified</div>
                    <div className="text-sm text-gray-600">{cvData.aclsBls.aclsProvider}</div>
                    <div className="text-xs text-gray-500">{cvData.aclsBls.aclsIssueDate} - {cvData.aclsBls.aclsExpiryDate}</div>
                  </div>
                )}
                {cvData.aclsBls.blsCertified && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="font-bold text-[#169AB4]">BLS Certified</div>
                    <div className="text-sm text-gray-600">{cvData.aclsBls.blsProvider}</div>
                    <div className="text-xs text-gray-500">{cvData.aclsBls.blsIssueDate} - {cvData.aclsBls.blsExpiryDate}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {cvData?.significantAchievements && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#04445E] mb-6 border-b-2 border-gray-200 pb-2">
                Significant Achievements
              </h2>
              <div className="text-gray-700 whitespace-pre-line">
                {cvData.significantAchievements}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Edit
          </button>

          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-8 py-3 bg-[#04445E] text-white rounded-lg hover:bg-[#033a4d] transition-colors font-medium"
          >
            <Download className="h-5 w-5" />
            Download PDF Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVPreview;