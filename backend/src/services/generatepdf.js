import PDFDocument from 'pdfkit';
import axios from 'axios';

const COLORS = {
    primary: '#1a1a1a',
    accent: '#0066cc',
    text: '#333333',
    secondary: '#666666',
    light: '#999999',
    divider: '#cccccc'
};

const FONTS = {
    bold: 'Helvetica-Bold',
    regular: 'Helvetica',
    italic: 'Helvetica-Oblique'
};

const SIZES = {
    name: 26,
    contact: 10,
    sectionHeading: 13,
    jobTitle: 11,
    body: 10,
    small: 9
};

const MARGINS = {
    top: 50,
    bottom: 50,
    left: 60,
    right: 60
};

const LAYOUT = {
    contentWidth: 475,
    pageHeight: 792,
    photoSize: 80
};

async function fetchImageBuffer(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary');
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
}

function checkPageBreak(doc, currentY, requiredSpace) {
    if (currentY + requiredSpace > LAYOUT.pageHeight - MARGINS.bottom) {
        doc.addPage();
        return MARGINS.top;
    }
    return currentY;
}

function addSectionHeader(doc, title, y) {
    y = checkPageBreak(doc, y, 35);
    
    doc.fontSize(SIZES.sectionHeading)
        .fillColor(COLORS.primary)
        .font(FONTS.bold)
        .text(title.toUpperCase(), MARGINS.left, y);
    
    const lineY = y + 18;
    doc.moveTo(MARGINS.left, lineY)
        .lineTo(doc.page.width - MARGINS.right, lineY)
        .strokeColor(COLORS.divider)
        .lineWidth(1.5)
        .stroke();
    
    return lineY + 12;
}

async function addHeader(doc, data) {
    const { fullName, email, phone, city, address, nationality, gender, photo } = data.basicDetails;
    
    const photoX = doc.page.width - MARGINS.right - LAYOUT.photoSize;
    const photoY = MARGINS.top;
    
    if (photo) {
        try {
            const imageBuffer = await fetchImageBuffer(photo);
            if (imageBuffer) {
                doc.save();
                doc.circle(photoX + LAYOUT.photoSize / 2, photoY + LAYOUT.photoSize / 2, LAYOUT.photoSize / 2)
                    .clip();
                doc.image(imageBuffer, photoX, photoY, {
                    width: LAYOUT.photoSize,
                    height: LAYOUT.photoSize,
                    align: 'center',
                    valign: 'center'
                });
                doc.restore();
            }
        } catch (error) {
            console.error('Error adding photo:', error);
        }
    }
    
    const nameWidth = photo ? LAYOUT.contentWidth - LAYOUT.photoSize - 20 : LAYOUT.contentWidth;
    
    doc.fontSize(SIZES.name)
        .fillColor(COLORS.primary)
        .font(FONTS.bold)
        .text(fullName.toUpperCase(), MARGINS.left, MARGINS.top, {
            width: nameWidth,
            align: 'left'
        });
    
    let y = MARGINS.top + 35;
    
    doc.fontSize(SIZES.contact).fillColor(COLORS.secondary).font(FONTS.regular);
    
    const contactLines = [];
    if (email || phone) {
        contactLines.push([email, phone].filter(Boolean).join(' | '));
    }
    if (address || city) {
        contactLines.push([address, city].filter(Boolean).join(', '));
    }
    
    const additionalInfo = [];
    if (nationality) additionalInfo.push(`Nationality: ${nationality}`);
    if (gender && gender !== 'prefer-not-to-say') {
        additionalInfo.push(`Gender: ${gender.charAt(0).toUpperCase() + gender.slice(1)}`);
    }
    if (additionalInfo.length) contactLines.push(additionalInfo.join(' | '));
    
    const medicalInfo = [];
    if (data.basicDetails.medicalSchool) medicalInfo.push(data.basicDetails.medicalSchool);
    if (data.basicDetails.mbbsRegNo) medicalInfo.push(`Reg No: ${data.basicDetails.mbbsRegNo}`);
    if (medicalInfo.length) contactLines.push(medicalInfo.join(' | '));
    
    if (data.basicDetails.usmleId) {
        contactLines.push(`USMLE ID: ${data.basicDetails.usmleId}`);
    }
    
    contactLines.forEach(line => {
        doc.text(line, MARGINS.left, y, { width: nameWidth });
        y += 14;
    });
    
    const headerEndY = Math.max(y, photoY + LAYOUT.photoSize);
    
    return headerEndY + 20;
}

function addEducation(doc, data, y) {
    y = addSectionHeader(doc, 'Education', y);
    
    const entries = [];
    
    if (data.education?.postGraduation?.universityName) {
        const pg = data.education.postGraduation;
        entries.push({
            degree: pg.degree || 'Post Graduation',
            specialization: pg.specialization,
            institution: pg.universityName,
            location: [pg.city, pg.state, pg.country].filter(Boolean).join(', '),
            year: pg.endDate ? pg.endDate.split('-')[0] : '',
            status: pg.status,
            grade: pg.overallGrade
        });
    }
    
    if (data.education?.graduation?.universityName) {
        const grad = data.education.graduation;
        entries.push({
            degree: grad.degree || 'MBBS',
            specialization: grad.specialization,
            institution: grad.universityName,
            location: [grad.city, grad.state, grad.country].filter(Boolean).join(', '),
            year: grad.endDate ? grad.endDate.split('-')[0] : '',
            grade: grad.overallGrade,
            classType: grad.classType
        });
    }
    
    if (data.education?.college?.collegeName) {
        const college = data.education.college;
        entries.push({
            degree: 'Higher Secondary',
            specialization: college.stream,
            institution: college.collegeName,
            location: [college.city, college.state].filter(Boolean).join(', '),
            year: college.endYear,
            grade: college.twelfthGrade
        });
    }
    
    if (data.education?.schooling?.schoolName) {
        const school = data.education.schooling;
        entries.push({
            degree: 'Secondary School',
            institution: school.schoolName,
            location: [school.city, school.state].filter(Boolean).join(', '),
            year: school.endYear,
            grade: school.grade
        });
    }
    
    entries.forEach((entry, index) => {
        if (index > 0) y += 18;
        
        y = checkPageBreak(doc, y, 80);
        
        doc.fontSize(SIZES.jobTitle).fillColor(COLORS.primary).font(FONTS.bold)
            .text(entry.degree, MARGINS.left, y);
        y += 15;
        
        if (entry.specialization) {
            doc.fontSize(SIZES.body).fillColor(COLORS.accent).font(FONTS.italic)
                .text(entry.specialization, MARGINS.left, y);
            y += 13;
        }
        
        doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular)
            .text(entry.institution, MARGINS.left, y);
        y += 13;
        
        if (entry.location) {
            doc.fillColor(COLORS.secondary).font(FONTS.italic)
                .text(entry.location, MARGINS.left, y);
            y += 13;
        }
        
        const details = [entry.year, entry.grade, entry.classType, entry.status].filter(Boolean);
        if (details.length) {
            doc.fillColor(COLORS.secondary).font(FONTS.regular)
                .text(details.join(' | '), MARGINS.left, y);
            y += 13;
        }
    });
    
    return y + 20;
}

function addLanguages(doc, data, y) {
    if (!data.basicDetails?.languages?.length) return y;
    
    y = addSectionHeader(doc, 'Languages', y);
    
    doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular);
    
    data.basicDetails.languages.forEach((lang, index) => {
        if (index > 0) y += 8;
        y = checkPageBreak(doc, y, 30);
        
        const fluency = lang.fluency.charAt(0).toUpperCase() + lang.fluency.slice(1);
        doc.font(FONTS.bold).text(lang.language, MARGINS.left, y, { continued: true })
           .font(FONTS.regular).fillColor(COLORS.secondary).text(` - ${fluency}`);
        y += 14;
    });
    
    return y + 20;
}

function addUSMLEScores(doc, data, y) {
    if (!data.usmleScores) return y;
    
    const hasInfo = data.usmleScores.step1Status !== 'not-taken' || 
                    data.usmleScores.step2ckScore || 
                    data.usmleScores.step2csStatus !== 'not-taken' ||
                    data.usmleScores.oetScore ||
                    data.usmleScores.ecfmgCertified;
    
    if (!hasInfo) return y;
    
    y = addSectionHeader(doc, 'USMLE Scores', y);
    
    doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular);
    
    if (data.usmleScores.step1Status && data.usmleScores.step1Status !== 'not-taken') {
        y = checkPageBreak(doc, y, 30);
        doc.font(FONTS.bold).text('Step 1: ', MARGINS.left, y, { continued: true })
           .font(FONTS.regular).text(data.usmleScores.step1Status.toUpperCase());
        y += 14;
        
        if (data.usmleScores.step1Cert?.url) {
            doc.fillColor(COLORS.accent).font(FONTS.regular)
                .text('View Certificate', MARGINS.left + 15, y, { 
                    link: data.usmleScores.step1Cert.url,
                    underline: true
                });
            y += 14;
            doc.fillColor(COLORS.text);
        }
    }
    
    if (data.usmleScores.step2ckScore) {
        y = checkPageBreak(doc, y, 30);
        doc.font(FONTS.bold).text('Step 2 CK: ', MARGINS.left, y, { continued: true })
           .font(FONTS.regular).text(data.usmleScores.step2ckScore);
        y += 14;
        
        if (data.usmleScores.step2Cert?.url) {
            doc.fillColor(COLORS.accent).font(FONTS.regular)
                .text('View Certificate', MARGINS.left + 15, y, { 
                    link: data.usmleScores.step2Cert.url,
                    underline: true
                });
            y += 14;
            doc.fillColor(COLORS.text);
        }
    }
    
    if (data.usmleScores.step2csStatus && data.usmleScores.step2csStatus !== 'not-taken') {
        y = checkPageBreak(doc, y, 20);
        doc.font(FONTS.bold).text('Step 2 CS: ', MARGINS.left, y, { continued: true })
           .font(FONTS.regular).text(data.usmleScores.step2csStatus.toUpperCase());
        y += 14;
    }
    
    if (data.usmleScores.oetScore) {
        y = checkPageBreak(doc, y, 30);
        doc.font(FONTS.bold).text('OET Score: ', MARGINS.left, y, { continued: true })
           .font(FONTS.regular).text(data.usmleScores.oetScore);
        y += 14;
        
        if (data.usmleScores.oetCert?.url) {
            doc.fillColor(COLORS.accent).font(FONTS.regular)
                .text('View Certificate', MARGINS.left + 15, y, { 
                    link: data.usmleScores.oetCert.url,
                    underline: true
                });
            y += 14;
            doc.fillColor(COLORS.text);
        }
    }
    
    if (data.usmleScores.ecfmgCertified) {
        y = checkPageBreak(doc, y, 20);
        doc.font(FONTS.bold).fillColor(COLORS.accent)
           .text('✓ ECFMG Certified', MARGINS.left, y);
        y += 14;
    }
    
    return y + 20;
}

function addSkills(doc, data, y) {
    if (!data.skills?.skillsList && (!data.skills?.supportingDocuments?.length)) return y;
    
    y = addSectionHeader(doc, 'Skills', y);
    
    if (data.skills?.skillsList) {
        doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular);
        const skills = data.skills.skillsList.split(',').map(s => s.trim()).filter(Boolean);
        
        const skillsText = skills.join(' • ');
        doc.text(skillsText, MARGINS.left, y, { width: LAYOUT.contentWidth });
        y += doc.heightOfString(skillsText, { width: LAYOUT.contentWidth }) + 10;
    }
    
    if (data.skills?.supportingDocuments?.length) {
        y += 8;
        y = checkPageBreak(doc, y, 30);
        
        doc.fontSize(SIZES.body).fillColor(COLORS.secondary).font(FONTS.bold)
            .text('Documents:', MARGINS.left, y);
        y += 14;
        
        data.skills.supportingDocuments.forEach(item => {
            if (item.url) {
                y = checkPageBreak(doc, y, 15);
                doc.fontSize(SIZES.body).fillColor(COLORS.accent).font(FONTS.regular)
                    .text(`• ${item.name}`, MARGINS.left, y, { 
                        link: item.url,
                        underline: true,
                        width: LAYOUT.contentWidth
                    });
                y += 14;
            }
        });
    }
    
    return y + 20;
}

function addCertifications(doc, data, y) {
    const certs = [];
    
    if (data.aclsBls?.aclsCertified) {
        certs.push({ 
            name: 'ACLS', 
            dates: [data.aclsBls.aclsIssueDate, data.aclsBls.aclsExpiryDate].filter(Boolean).join(' - '),
            provider: data.aclsBls.aclsProvider
        });
    }
    if (data.aclsBls?.blsCertified) {
        certs.push({ 
            name: 'BLS', 
            dates: [data.aclsBls.blsIssueDate, data.aclsBls.blsExpiryDate].filter(Boolean).join(' - '),
            provider: data.aclsBls.blsProvider
        });
    }
    
    if (!certs.length) return y;
    
    y = addSectionHeader(doc, 'Certifications', y);
    
    certs.forEach((cert, index) => {
        if (index > 0) y += 18;
        y = checkPageBreak(doc, y, 50);
        
        doc.fontSize(SIZES.jobTitle).fillColor(COLORS.primary).font(FONTS.bold)
            .text(cert.name, MARGINS.left, y);
        y += 15;
        
        if (cert.provider) {
            doc.fontSize(SIZES.body).font(FONTS.regular).fillColor(COLORS.text)
                .text(cert.provider, MARGINS.left, y);
            y += 13;
        }
        
        if (cert.dates) {
            doc.font(FONTS.italic).fillColor(COLORS.secondary)
                .text(cert.dates, MARGINS.left, y);
            y += 13;
        }
    });
    
    return y + 20;
}

function addEMRTraining(doc, data, y) {
    if (!data.emrRcmTraining || (!data.emrRcmTraining.emrSystems?.length && !data.emrRcmTraining.rcmTraining)) {
        return y;
    }
    
    y = addSectionHeader(doc, 'EMR/RCM Training', y);
    
    doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular);
    
    if (data.emrRcmTraining.emrSystems?.length) {
        y = checkPageBreak(doc, y, 40);
        
        doc.font(FONTS.bold).text('EMR Systems:', MARGINS.left, y);
        y += 14;
        
        const systems = data.emrRcmTraining.emrSystems.join(' • ');
        doc.font(FONTS.regular).text(systems, MARGINS.left, y, { width: LAYOUT.contentWidth });
        y += doc.heightOfString(systems, { width: LAYOUT.contentWidth }) + 10;
    }
    
    if (data.emrRcmTraining.rcmTraining) {
        y += 8;
        y = checkPageBreak(doc, y, 30);
        
        doc.font(FONTS.bold).text('RCM Training', MARGINS.left, y);
        y += 14;
        
        if (data.emrRcmTraining.duration) {
            doc.font(FONTS.regular).fillColor(COLORS.secondary)
                .text(`Duration: ${data.emrRcmTraining.duration}`, MARGINS.left, y);
            y += 13;
        }
    }
    
    return y + 20;
}

function addExperience(doc, experiences, title, y) {
    if (!experiences?.length) return y;
    
    y = addSectionHeader(doc, title, y);
    
    experiences.forEach((exp, index) => {
        if (index > 0) y += 20;
        
        y = checkPageBreak(doc, y, 100);
        
        const jobTitle = exp.title || exp.position || exp.role || '';
        const org = exp.hospital || exp.organization || '';
        
        if (jobTitle) {
            doc.fontSize(SIZES.jobTitle).fillColor(COLORS.primary).font(FONTS.bold)
                .text(jobTitle, MARGINS.left, y);
            y += 15;
        }
        
        if (org) {
            doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular)
                .text(org, MARGINS.left, y);
            y += 13;
        }
        
        const locationParts = [exp.city, exp.state, exp.country, exp.location].filter(Boolean);
        const dateStr = exp.duration || 
                       (exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}` : '');
        
        const info = [];
        if (locationParts.length) info.push(locationParts.join(', '));
        if (dateStr) info.push(dateStr);
        
        if (info.length) {
            doc.fillColor(COLORS.secondary).font(FONTS.italic)
                .text(info.join(' | '), MARGINS.left, y, { width: LAYOUT.contentWidth });
            y += 13;
        }
        
        if (exp.supervisor) {
            doc.fillColor(COLORS.secondary).font(FONTS.italic)
                .text(`Supervisor: ${exp.supervisor}`, MARGINS.left, y);
            y += 13;
        }
        
        if (exp.description) {
            y += 5;
            doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular);
            const lines = exp.description.split('\n').filter(l => l.trim());
            lines.forEach(line => {
                const text = `• ${line.trim()}`;
                const lineHeight = doc.heightOfString(text, { width: LAYOUT.contentWidth });
                y = checkPageBreak(doc, y, lineHeight + 5);
                doc.text(text, MARGINS.left, y, { width: LAYOUT.contentWidth });
                y += lineHeight + 3;
            });
        }
    });
    
    return y + 20;
}

function addAchievements(doc, data, y) {
    const hasSignificant = data.significantAchievements?.trim();
    const hasArray = data.achievements?.length;
    
    if (!hasSignificant && !hasArray) return y;
    
    y = addSectionHeader(doc, 'Achievements', y);
    
    if (hasSignificant) {
        doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular);
        const lines = data.significantAchievements.split('\n').filter(l => l.trim());
        lines.forEach(line => {
            const text = `• ${line.trim()}`;
            const lineHeight = doc.heightOfString(text, { width: LAYOUT.contentWidth });
            y = checkPageBreak(doc, y, lineHeight + 5);
            doc.text(text, MARGINS.left, y, { width: LAYOUT.contentWidth });
            y += lineHeight + 3;
        });
        y += 12;
    }
    
    if (hasArray) {
        data.achievements.forEach((achievement, index) => {
            if (index > 0 || hasSignificant) y += 15;
            
            y = checkPageBreak(doc, y, 80);
            
            doc.fontSize(SIZES.jobTitle).fillColor(COLORS.primary).font(FONTS.bold)
                .text(achievement.title, MARGINS.left, y, { width: LAYOUT.contentWidth });
            y += 15;
            
            if (achievement.date) {
                doc.fontSize(SIZES.body).fillColor(COLORS.secondary).font(FONTS.italic)
                    .text(achievement.date, MARGINS.left, y);
                y += 13;
            }
            
            if (achievement.description) {
                doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular)
                    .text(achievement.description, MARGINS.left, y, { width: LAYOUT.contentWidth });
                y += doc.heightOfString(achievement.description, { width: LAYOUT.contentWidth }) + 8;
            }
            
            if (achievement.url?.trim()) {
                doc.fontSize(SIZES.body).fillColor(COLORS.accent).font(FONTS.regular)
                    .text('View Document', MARGINS.left, y, { 
                        link: achievement.url,
                        underline: true
                    });
                y += 13;
            }
        });
    }
    
    return y + 20;
}

function addPublications(doc, data, y) {
    if (!data.publications?.length) return y;
    
    y = addSectionHeader(doc, 'Publications', y);
    
    data.publications.forEach((pub, index) => {
        if (index > 0) y += 15;
        
        y = checkPageBreak(doc, y, 60);
        
        doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular);
        const title = `${index + 1}. ${pub.title}`;
        doc.text(title, MARGINS.left, y, { width: LAYOUT.contentWidth });
        y += doc.heightOfString(title, { width: LAYOUT.contentWidth }) + 5;
        
        const details = [pub.journal, pub.year];
        if (pub.type) details.push(`(${pub.type.replace('-', ' ')})`);
        
        doc.font(FONTS.italic).fillColor(COLORS.secondary)
            .text(details.join(', '), MARGINS.left, y, { width: LAYOUT.contentWidth });
        y += 13;
        
        if (pub.supportingDocument?.url) {
            doc.fillColor(COLORS.accent).font(FONTS.regular)
                .text('View Publication', MARGINS.left, y, { 
                    link: pub.supportingDocument.url,
                    underline: true
                });
            y += 13;
        }
    });
    
    return y + 20;
}

function addConferences(doc, data, y) {
    if (!data.conferences?.length) return y;
    
    y = addSectionHeader(doc, 'Conferences', y);
    
    data.conferences.forEach((conf, index) => {
        if (index > 0) y += 18;
        
        y = checkPageBreak(doc, y, 100);
        
        doc.fontSize(SIZES.jobTitle).fillColor(COLORS.primary).font(FONTS.bold)
            .text(conf.name, MARGINS.left, y, { width: LAYOUT.contentWidth });
        y += 15;
        
        const details = [conf.role, conf.year].filter(Boolean);
        if (details.length) {
            doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular)
                .text(details.join(' | '), MARGINS.left, y);
            y += 13;
        }
        
        const location = [conf.location, conf.country].filter(Boolean).join(', ');
        if (location) {
            doc.fillColor(COLORS.secondary).font(FONTS.italic)
                .text(location, MARGINS.left, y);
            y += 13;
        }
        
        if (conf.description) {
            doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular)
                .text(conf.description, MARGINS.left, y, { width: LAYOUT.contentWidth });
            y += doc.heightOfString(conf.description, { width: LAYOUT.contentWidth }) + 8;
        }
        
        if (conf.certificateAwarded) {
            doc.fillColor(COLORS.accent).font(FONTS.italic)
                .text('✓ Certificate Awarded', MARGINS.left, y);
            y += 13;
        }
        
        if (conf.supportingDocument?.url) {
            doc.fillColor(COLORS.accent).font(FONTS.regular)
                .text('View Certificate', MARGINS.left, y, { 
                    link: conf.supportingDocument.url,
                    underline: true
                });
            y += 13;
        }
    });
    
    return y + 20;
}

function addWorkshops(doc, data, y) {
    if (!data.workshops?.length) return y;
    
    y = addSectionHeader(doc, 'Workshops & Training', y);
    
    data.workshops.forEach((workshop, index) => {
        if (index > 0) y += 18;
        
        y = checkPageBreak(doc, y, 80);
        
        doc.fontSize(SIZES.jobTitle).fillColor(COLORS.primary).font(FONTS.bold)
            .text(workshop.name, MARGINS.left, y, { width: LAYOUT.contentWidth });
        y += 15;
        
        const details = [workshop.organizer, workshop.year || workshop.date].filter(Boolean);
        if (details.length) {
            doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular)
                .text(details.join(' | '), MARGINS.left, y);
            y += 13;
        }
        
        if (workshop.description) {
            doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular)
                .text(workshop.description, MARGINS.left, y, { width: LAYOUT.contentWidth });
            y += doc.heightOfString(workshop.description, { width: LAYOUT.contentWidth }) + 8;
        }
        
        if (workshop.awards) {
            doc.fillColor(COLORS.accent).font(FONTS.italic)
                .text(`Awards: ${workshop.awards}`, MARGINS.left, y, { width: LAYOUT.contentWidth });
            y += 13;
        }
    });
    
    return y + 20;
}

export async function generateCVPDF(cvData) {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ 
                size: 'A4', 
                margins: MARGINS,
                bufferPages: true
            });
            
            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            
            let y = await addHeader(doc, cvData);
            
            y = addEducation(doc, cvData, y);
            y = addLanguages(doc, cvData, y);
            y = addUSMLEScores(doc, cvData, y);
            y = addSkills(doc, cvData, y);
            y = addCertifications(doc, cvData, y);
            y = addEMRTraining(doc, cvData, y);
            y = addExperience(doc, cvData.usClinicalExperience?.list, 'US Clinical Experience', y);
            y = addExperience(doc, cvData.clinicalExperiences, 'Clinical Experience', y);
            y = addExperience(doc, cvData.workExperience, 'Work Experience', y);
            y = addExperience(doc, cvData.professionalExperiences, 'Professional Experience', y);
            y = addExperience(doc, cvData.volunteerExperiences, 'Volunteer Experience', y);
            y = addAchievements(doc, cvData, y);
            y = addPublications(doc, cvData, y);
            y = addConferences(doc, cvData, y);
            y = addWorkshops(doc, cvData, y);
            
            const pageCount = doc.bufferedPageRange().count;
            for (let i = 0; i < pageCount; i++) {
                doc.switchToPage(i);
                doc.fontSize(8).fillColor(COLORS.light)
                    .text(`${cvData.basicDetails.fullName} - Page ${i + 1}`, 
                          MARGINS.left, 
                          LAYOUT.pageHeight - 35, 
                          { align: 'center', width: LAYOUT.contentWidth });
            }
            
            doc.end();
            
        } catch (error) {
            reject(error);
        }
    });
}