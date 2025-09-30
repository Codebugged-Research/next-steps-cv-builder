import PDFDocument from 'pdfkit';
import { CV } from '../models/cv.model.js';

export const generateCVPDF = async (userId) => {
    try {
        const cvData = await CV.findOne({ userId }).populate('userId');
        if (!cvData) {
            throw new Error('CV not found');
        }
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];        
        doc.on('data', chunk => chunks.push(chunk));
        
        const pdfPromise = new Promise((resolve) => {
            doc.on('end', () => resolve(Buffer.concat(chunks)));
        });
        generateCVContent(doc, cvData);
        doc.end();

        return await pdfPromise;
    } catch (error) {
        throw new Error(`PDF generation failed: ${error.message}`);
    }
};

const generateCVContent = (doc, cvData) => {
    const primaryColor = '#04445E';
    const secondaryColor = '#169AB4';
    
    // Header Section
    doc.fontSize(24)
       .fillColor(primaryColor)
       .text(cvData.basicDetails.fullName, { align: 'center' });
    
    doc.fontSize(12)
       .fillColor('black')
       .text(`${cvData.basicDetails.email} | ${cvData.basicDetails.phone}`, { align: 'center' });
    
    if (cvData.basicDetails.address) {
        doc.text(cvData.basicDetails.address, { align: 'center' });
    }
    
    doc.text(`${cvData.basicDetails.city}`, { align: 'center' })
       .moveDown(2);

    // Personal Information Section
    addSection(doc, 'Personal Information', primaryColor);
    if (cvData.basicDetails.gender && cvData.basicDetails.gender !== '') {
        doc.fontSize(10).text(`Gender: ${capitalizeFirst(cvData.basicDetails.gender)}`);
    }
    if (cvData.basicDetails.nationality) {
        doc.text(`Nationality: ${cvData.basicDetails.nationality}`);
    }
    if (cvData.basicDetails.usmleId) {
        doc.text(`USMLE ID: ${cvData.basicDetails.usmleId}`);
    }
    if (cvData.basicDetails.mbbsRegNo) {
        doc.text(`MBBS Registration No: ${cvData.basicDetails.mbbsRegNo}`);
    }
    if (cvData.basicDetails.medicalSchool) {
        doc.text(`Medical School: ${cvData.basicDetails.medicalSchool}`);
    }
    if (cvData.basicDetails.graduationYear) {
        doc.text(`Graduation Year: ${cvData.basicDetails.graduationYear}`);
    }
    doc.moveDown();

    // Languages
    if (cvData.basicDetails.languages && cvData.basicDetails.languages.length > 0) {
        addSection(doc, 'Languages', primaryColor);
        cvData.basicDetails.languages.forEach(lang => {
            if (lang.language) {
                doc.fontSize(10)
                   .text(`${lang.language}: ${capitalizeFirst(lang.fluency || 'Not specified')}`);
            }
        });
        doc.moveDown();
    }

    // Education - Schooling
    if (cvData.education.schooling.schoolName) {
        addSection(doc, 'Schooling', primaryColor);
        doc.fontSize(11)
           .fillColor('black')
           .text(cvData.education.schooling.schoolName);
        
        if (cvData.education.schooling.board) {
            doc.fontSize(10).text(`Board: ${cvData.education.schooling.board}`);
        }
        if (cvData.education.schooling.city && cvData.education.schooling.state) {
            doc.text(`Location: ${cvData.education.schooling.city}, ${cvData.education.schooling.state}`);
        }
        if (cvData.education.schooling.startYear && cvData.education.schooling.endYear) {
            doc.text(`Duration: ${cvData.education.schooling.startYear} - ${cvData.education.schooling.endYear}`);
        }
        if (cvData.education.schooling.grade) {
            doc.text(`Grade: ${cvData.education.schooling.grade}`);
        }
        doc.moveDown();
    }

    // Education - College
    if (cvData.education.college.collegeName) {
        addSection(doc, 'Higher Secondary Education', primaryColor);
        doc.fontSize(11)
           .fillColor('black')
           .text(cvData.education.college.collegeName);
        
        if (cvData.education.college.stream) {
            doc.fontSize(10).text(`Stream: ${cvData.education.college.stream}`);
        }
        if (cvData.education.college.city && cvData.education.college.state) {
            doc.text(`Location: ${cvData.education.college.city}, ${cvData.education.college.state}`);
        }
        if (cvData.education.college.startYear && cvData.education.college.endYear) {
            doc.text(`Duration: ${cvData.education.college.startYear} - ${cvData.education.college.endYear}`);
        }
        if (cvData.education.college.eleventhGrade) {
            doc.text(`11th Grade: ${cvData.education.college.eleventhGrade}`);
        }
        if (cvData.education.college.twelfthGrade) {
            doc.text(`12th Grade: ${cvData.education.college.twelfthGrade}`);
        }
        doc.moveDown();
    }

    // Education - Graduation
    if (cvData.education.graduation.universityName) {
        addSection(doc, 'Graduation', primaryColor);
        doc.fontSize(11)
           .fillColor('black')
           .text(cvData.education.graduation.universityName);
        
        if (cvData.education.graduation.degree) {
            doc.fontSize(10).text(`Degree: ${cvData.education.graduation.degree}`);
        }
        if (cvData.education.graduation.specialization) {
            doc.text(`Specialization: ${cvData.education.graduation.specialization}`);
        }
        if (cvData.education.graduation.city && cvData.education.graduation.state && cvData.education.graduation.country) {
            doc.text(`Location: ${cvData.education.graduation.city}, ${cvData.education.graduation.state}, ${cvData.education.graduation.country}`);
        }
        if (cvData.education.graduation.startDate && cvData.education.graduation.endDate) {
            doc.text(`Duration: ${cvData.education.graduation.startDate} - ${cvData.education.graduation.endDate}`);
        }
        if (cvData.education.graduation.classType) {
            doc.text(`Class: ${cvData.education.graduation.classType}`);
        }
        if (cvData.education.graduation.overallGrade) {
            doc.text(`Overall Grade: ${cvData.education.graduation.overallGrade}`);
        }
        
        // Year-wise percentages
        const yearPercentages = [];
        if (cvData.education.graduation.firstYearPercentage) yearPercentages.push(`1st Year: ${cvData.education.graduation.firstYearPercentage}`);
        if (cvData.education.graduation.secondYearPercentage) yearPercentages.push(`2nd Year: ${cvData.education.graduation.secondYearPercentage}`);
        if (cvData.education.graduation.thirdYearPercentage) yearPercentages.push(`3rd Year: ${cvData.education.graduation.thirdYearPercentage}`);
        if (cvData.education.graduation.finalYearPercentage) yearPercentages.push(`Final Year: ${cvData.education.graduation.finalYearPercentage}`);
        
        if (yearPercentages.length > 0) {
            doc.text(`Year-wise Performance: ${yearPercentages.join(', ')}`);
        }
        doc.moveDown();
    }

    // Education - Post Graduation
    if (cvData.education.postGraduation.universityName) {
        addSection(doc, 'Post Graduation', primaryColor);
        doc.fontSize(11)
           .fillColor('black')
           .text(cvData.education.postGraduation.universityName);
        
        if (cvData.education.postGraduation.degree) {
            doc.fontSize(10).text(`Degree: ${cvData.education.postGraduation.degree}`);
        }
        if (cvData.education.postGraduation.specialization) {
            doc.text(`Specialization: ${cvData.education.postGraduation.specialization}`);
        }
        if (cvData.education.postGraduation.city && cvData.education.postGraduation.state && cvData.education.postGraduation.country) {
            doc.text(`Location: ${cvData.education.postGraduation.city}, ${cvData.education.postGraduation.state}, ${cvData.education.postGraduation.country}`);
        }
        if (cvData.education.postGraduation.startDate && cvData.education.postGraduation.endDate) {
            doc.text(`Duration: ${cvData.education.postGraduation.startDate} - ${cvData.education.postGraduation.endDate}`);
        }
        if (cvData.education.postGraduation.status) {
            doc.text(`Status: ${cvData.education.postGraduation.status}`);
        }
        if (cvData.education.postGraduation.overallGrade) {
            doc.text(`Overall Grade: ${cvData.education.postGraduation.overallGrade}`);
        }
        doc.moveDown();
    }

    // USMLE Scores
    if (cvData.usmleScores.step1Status !== 'not-taken' || cvData.usmleScores.step2ckScore || cvData.usmleScores.step2csStatus !== 'not-taken') {
        addSection(doc, 'USMLE Scores', primaryColor);
        if (cvData.usmleScores.step1Status && cvData.usmleScores.step1Status !== 'not-taken') {
            doc.fontSize(10).text(`USMLE Step 1: ${cvData.usmleScores.step1Status.toUpperCase()}`);
        }
        if (cvData.usmleScores.step2ckScore) {
            doc.text(`USMLE Step 2 CK: ${cvData.usmleScores.step2ckScore}`);
        }
        if (cvData.usmleScores.step2csStatus && cvData.usmleScores.step2csStatus !== 'not-taken') {
            doc.text(`USMLE Step 2 CS: ${cvData.usmleScores.step2csStatus.toUpperCase()}`);
        }
        if (cvData.usmleScores.ecfmgCertified) {
            doc.text(`ECFMG Certified: Yes`);
        }
        doc.moveDown();
    }

    // Clinical Experiences
    if (cvData.clinicalExperiences && cvData.clinicalExperiences.length > 0) {
        addSection(doc, 'Clinical Experience', primaryColor);
        cvData.clinicalExperiences.forEach(exp => {
            doc.fontSize(11)
               .fillColor('black')
               .text(exp.title, { continued: true })
               .fontSize(10)
               .fillColor('gray')
               .text(` - ${exp.hospital}`)
               .text(exp.duration)
               .fontSize(10)
               .fillColor('black')
               .text(exp.description)
               .moveDown(0.5);
        });
        doc.moveDown();
    }

    // Professional Experiences
    if (cvData.professionalExperiences && cvData.professionalExperiences.length > 0) {
        addSection(doc, 'Professional Experience', primaryColor);
        cvData.professionalExperiences.forEach(exp => {
            doc.fontSize(11)
               .fillColor('black')
               .text(exp.position, { continued: true })
               .fontSize(10)
               .fillColor('gray')
               .text(` - ${exp.organization}`)
               .text(exp.duration)
               .fontSize(10)
               .fillColor('black')
               .text(exp.description)
               .moveDown(0.5);
        });
        doc.moveDown();
    }

    // Volunteer Experiences
    if (cvData.volunteerExperiences && cvData.volunteerExperiences.length > 0) {
        addSection(doc, 'Volunteer Experience', primaryColor);
        cvData.volunteerExperiences.forEach(exp => {
            doc.fontSize(11)
               .fillColor('black')
               .text(exp.role, { continued: true })
               .fontSize(10)
               .fillColor('gray')
               .text(` - ${exp.organization}`)
               .text(exp.duration)
               .fontSize(10)
               .fillColor('black')
               .text(exp.description)
               .moveDown(0.5);
        });
        doc.moveDown();
    }

    // Skills
    if (cvData.skills && cvData.skills.skillsList) {
        addSection(doc, 'Skills', primaryColor);
        doc.fontSize(10).text(cvData.skills.skillsList);
        doc.moveDown();
    }

    // Publications
    if (cvData.publications && cvData.publications.length > 0) {
        addSection(doc, 'Publications', primaryColor);
        cvData.publications.forEach((pub, index) => {
            doc.fontSize(10)
               .fillColor('black')
               .text(`${index + 1}. ${pub.title}`)
               .fillColor('gray')
               .text(`${pub.journal}, ${pub.year}`)
               .fillColor('black');
            if (pub.type) {
                doc.text(`Type: ${formatPublicationType(pub.type)}`);
            }
            doc.moveDown(0.5);
        });
        doc.moveDown();
    }

    // Conferences
    if (cvData.conferences && cvData.conferences.length > 0) {
        addSection(doc, 'Conferences', primaryColor);
        cvData.conferences.forEach(conf => {
            doc.fontSize(10)
               .fillColor('black')
               .text(`${conf.name} (${conf.year})`);
            
            if (conf.location && conf.country) {
                doc.fillColor('gray')
                   .text(`Location: ${conf.location}, ${conf.country}`)
                   .fillColor('black');
            }
            
            doc.text(`Role: ${conf.role}`);
            
            if (conf.certificateAwarded) {
                doc.text('Certificate Awarded: Yes');
            }
            
            if (conf.description) {
                doc.text(conf.description);
            }
            doc.moveDown(0.5);
        });
        doc.moveDown();
    }

    // Workshops
    if (cvData.workshops && cvData.workshops.length > 0) {
        addSection(doc, 'Workshops & Training', primaryColor);
        cvData.workshops.forEach(workshop => {
            doc.fontSize(10)
               .fillColor('black')
               .text(`${workshop.name}`);
            
            if (workshop.organizer) {
                doc.fillColor('gray')
                   .text(`Organizer: ${workshop.organizer}`)
                   .fillColor('black');
            }
            
            if (workshop.year || workshop.date) {
                doc.text(`Date: ${workshop.date || workshop.year}`);
            }
            
            if (workshop.awards) {
                doc.text(`Awards: ${workshop.awards}`);
            }
            
            if (workshop.description) {
                doc.text(workshop.description);
            }
            doc.moveDown(0.5);
        });
        doc.moveDown();
    }

    // Achievements (array type)
    if (cvData.achievements && cvData.achievements.length > 0) {
        addSection(doc, 'Achievements', primaryColor);
        cvData.achievements.forEach((achievement, index) => {
            doc.fontSize(10)
               .fillColor('black')
               .text(`${index + 1}. ${achievement.title}`);
            
            if (achievement.date) {
                doc.fillColor('gray')
                   .text(`Date: ${achievement.date}`)
                   .fillColor('black');
            }
            
            if (achievement.description) {
                doc.text(achievement.description);
            }
            
            if (achievement.url && achievement.attachmentType === 'url') {
                doc.fillColor(secondaryColor)
                   .text(`Link: ${achievement.url}`)
                   .fillColor('black');
            }
            doc.moveDown(0.5);
        });
        doc.moveDown();
    }

    // Significant Achievements (text type)
    if (cvData.significantAchievements) {
        addSection(doc, 'Significant Achievements', primaryColor);
        doc.fontSize(10).text(cvData.significantAchievements);
        doc.moveDown();
    }

    // EMR/RCM Training
    if (cvData.emrRcmTraining && (cvData.emrRcmTraining.emrSystems.length > 0 || cvData.emrRcmTraining.rcmTraining)) {
        addSection(doc, 'EMR/RCM Training', primaryColor);
        
        if (cvData.emrRcmTraining.emrSystems.length > 0) {
            doc.fontSize(10)
               .text(`EMR Systems: ${cvData.emrRcmTraining.emrSystems.join(', ')}`);
        }
        
        if (cvData.emrRcmTraining.rcmTraining) {
            doc.text('RCM Training: Completed');
        }
        
        if (cvData.emrRcmTraining.duration) {
            doc.text(`Training Duration: ${cvData.emrRcmTraining.duration}`);
        }
        doc.moveDown();
    }
};

const addSection = (doc, title, color) => {
    doc.fontSize(14)
       .fillColor(color)
       .text(title)
       .strokeColor(color)
       .lineWidth(1)
       .moveTo(50, doc.y)
       .lineTo(550, doc.y)
       .stroke()
       .fillColor('black')
       .moveDown(0.5);
};

const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatPublicationType = (type) => {
    const typeMap = {
        'research-article': 'Research Article',
        'case-report': 'Case Report',
        'review-article': 'Review Article',
        'conference-paper': 'Conference Paper'
    };
    return typeMap[type] || type;
};