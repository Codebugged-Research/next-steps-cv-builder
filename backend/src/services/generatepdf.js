import PDFDocument from 'pdfkit';
import axios from 'axios';

const COLORS = {
    primary: '#1a1a1a',
    accent: '#0066cc',
    text: '#333333',
    secondary: '#666666',
    light: '#999999',
    divider: '#e0e0e0'
};

const FONTS = {
    bold: 'Helvetica-Bold',
    regular: 'Helvetica',
    italic: 'Helvetica-Oblique'
};

const SIZES = {
    name: 24,
    contact: 9,
    heading: 12,
    subheading: 10,
    body: 9,
    small: 8
};

const MARGINS = {
    page: { top: 50, bottom: 50, left: 50, right: 50 },
    section: 15
};

const LAYOUT = {
    leftCol: { x: 50, width: 170 },
    rightCol: { x: 235, width: 310 },
    pageWidth: 595,
    pageHeight: 842
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

function drawSectionDivider(doc, x, width, y) {
    doc.moveTo(x, y)
        .lineTo(x + width, y)
        .strokeColor(COLORS.divider)
        .lineWidth(1)
        .stroke();
    return y + 10;
}

function addSectionHeader(doc, title, x, width, y) {
    doc.fontSize(SIZES.heading)
        .fillColor(COLORS.primary)
        .font(FONTS.bold)
        .text(title.toUpperCase(), x, y, { width });
    
    return drawSectionDivider(doc, x, width, y + 16);
}

function addHeader(doc, data) {
    const { fullName, email, phone, city, address, nationality, gender } = data.basicDetails;
    
    doc.fontSize(SIZES.name)
        .fillColor(COLORS.primary)
        .font(FONTS.bold)
        .text(fullName.toUpperCase(), MARGINS.page.left, MARGINS.page.top, {
            width: LAYOUT.pageWidth - MARGINS.page.left - MARGINS.page.right
        });
    
    let y = MARGINS.page.top + 30;
    
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
        doc.text(line, MARGINS.page.left, y, {
            width: LAYOUT.pageWidth - MARGINS.page.left - MARGINS.page.right
        });
        y += 12;
    });
    
    return y + 15;
}

function addEducation(doc, data, y) {
    y = addSectionHeader(doc, 'Education', LAYOUT.leftCol.x, LAYOUT.leftCol.width, y);
    
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
        if (index > 0) y += 15;
        
        doc.fontSize(SIZES.body).fillColor(COLORS.primary).font(FONTS.bold)
            .text(entry.degree, LAYOUT.leftCol.x, y, { width: LAYOUT.leftCol.width });
        y += 12;
        
        if (entry.specialization) {
            doc.fontSize(SIZES.small).fillColor(COLORS.accent).font(FONTS.italic)
                .text(entry.specialization, LAYOUT.leftCol.x, y, { width: LAYOUT.leftCol.width });
            y += 11;
        }
        
        doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular)
            .text(entry.institution, LAYOUT.leftCol.x, y, { width: LAYOUT.leftCol.width });
        y += 11;
        
        if (entry.location) {
            doc.fillColor(COLORS.secondary).font(FONTS.italic)
                .text(entry.location, LAYOUT.leftCol.x, y, { width: LAYOUT.leftCol.width });
            y += 11;
        }
        
        const details = [entry.year, entry.grade, entry.classType, entry.status].filter(Boolean);
        if (details.length) {
            doc.fillColor(COLORS.secondary).font(FONTS.regular)
                .text(details.join(' | '), LAYOUT.leftCol.x, y, { width: LAYOUT.leftCol.width });
            y += 11;
        }
    });
    
    return y + MARGINS.section;
}

function addLanguages(doc, data, y) {
    if (!data.basicDetails?.languages?.length) return y;
    
    y = addSectionHeader(doc, 'Languages', LAYOUT.leftCol.x, LAYOUT.leftCol.width, y);
    
    doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular);
    
    data.basicDetails.languages.forEach(lang => {
        doc.text(`• ${lang.language}`, LAYOUT.leftCol.x, y, { width: LAYOUT.leftCol.width });
        y += 11;
        doc.fillColor(COLORS.secondary).font(FONTS.italic)
            .text(`  ${lang.fluency.charAt(0).toUpperCase() + lang.fluency.slice(1)}`, 
                  LAYOUT.leftCol.x, y, { width: LAYOUT.leftCol.width });
        y += 11;
        doc.font(FONTS.regular).fillColor(COLORS.text);
    });
    
    return y + MARGINS.section;
}

function addUSMLEScores(doc, data, y) {
    if (!data.usmleScores) return y;
    
    const hasInfo = data.usmleScores.step1Status !== 'not-taken' || 
                    data.usmleScores.step2ckScore || 
                    data.usmleScores.step2csStatus !== 'not-taken' ||
                    data.usmleScores.oetScore ||
                    data.usmleScores.ecfmgCertified;
    
    if (!hasInfo) return y;
    
    y = addSectionHeader(doc, 'USMLE Scores', LAYOUT.leftCol.x, LAYOUT.leftCol.width, y);
    
    doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular);
    
    if (data.usmleScores.step1Status && data.usmleScores.step1Status !== 'not-taken') {
        doc.font(FONTS.bold).text('Step 1: ', LAYOUT.leftCol.x, y, { 
            width: LAYOUT.leftCol.width, 
            continued: true 
        }).font(FONTS.regular).text(data.usmleScores.step1Status.toUpperCase());
        y += 11;
        
        if (data.usmleScores.step1Cert?.url) {
            doc.fillColor(COLORS.accent).font(FONTS.regular)
                .text('View Certificate', LAYOUT.leftCol.x + 10, y, { 
                    width: LAYOUT.leftCol.width - 10,
                    link: data.usmleScores.step1Cert.url,
                    underline: true
                });
            y += 11;
        }
    }
    
    if (data.usmleScores.step2ckScore) {
        doc.fillColor(COLORS.text).font(FONTS.bold).text('Step 2 CK: ', LAYOUT.leftCol.x, y, { 
            width: LAYOUT.leftCol.width, 
            continued: true 
        }).font(FONTS.regular).text(data.usmleScores.step2ckScore);
        y += 11;
        
        if (data.usmleScores.step2Cert?.url) {
            doc.fillColor(COLORS.accent).font(FONTS.regular)
                .text('View Certificate', LAYOUT.leftCol.x + 10, y, { 
                    width: LAYOUT.leftCol.width - 10,
                    link: data.usmleScores.step2Cert.url,
                    underline: true
                });
            y += 11;
        }
    }
    
    if (data.usmleScores.step2csStatus && data.usmleScores.step2csStatus !== 'not-taken') {
        doc.fillColor(COLORS.text).font(FONTS.bold).text('Step 2 CS: ', LAYOUT.leftCol.x, y, { 
            width: LAYOUT.leftCol.width, 
            continued: true 
        }).font(FONTS.regular).text(data.usmleScores.step2csStatus.toUpperCase());
        y += 11;
    }
    
    if (data.usmleScores.oetScore) {
        doc.fillColor(COLORS.text).font(FONTS.bold).text('OET Score: ', LAYOUT.leftCol.x, y, { 
            width: LAYOUT.leftCol.width, 
            continued: true 
        }).font(FONTS.regular).text(data.usmleScores.oetScore);
        y += 11;
        
        if (data.usmleScores.oetCert?.url) {
            doc.fillColor(COLORS.accent).font(FONTS.regular)
                .text('View Certificate', LAYOUT.leftCol.x + 10, y, { 
                    width: LAYOUT.leftCol.width - 10,
                    link: data.usmleScores.oetCert.url,
                    underline: true
                });
            y += 11;
        }
    }
    
    if (data.usmleScores.ecfmgCertified) {
        doc.font(FONTS.bold).fillColor(COLORS.accent)
           .text('✓ ECFMG Certified', LAYOUT.leftCol.x, y, { width: LAYOUT.leftCol.width });
        y += 11;
    }
    
    return y + MARGINS.section;
}

function addSkills(doc, data, y) {
    if (!data.skills?.skillsList && (!data.skills?.supportingDocuments?.length)) return y;
    
    y = addSectionHeader(doc, 'Skills', LAYOUT.leftCol.x, LAYOUT.leftCol.width, y);
    
    if (data.skills?.skillsList) {
        doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular);
        const skills = data.skills.skillsList.split(',').map(s => s.trim()).filter(Boolean);
        
        skills.forEach(skill => {
            doc.text(`• ${skill}`, LAYOUT.leftCol.x, y, { width: LAYOUT.leftCol.width });
            y += 11;
        });
    }
    
    if (data.skills?.supportingDocuments?.length) {
        y += 5;
        doc.fontSize(SIZES.small).fillColor(COLORS.secondary).font(FONTS.bold)
            .text('Documents:', LAYOUT.leftCol.x, y, { width: LAYOUT.leftCol.width });
        y += 11;
        
        data.skills.supportingDocuments.forEach(item => {
            if (item.url) {
                doc.fillColor(COLORS.accent).font(FONTS.regular)
                    .text(item.name, LAYOUT.leftCol.x, y, { 
                        width: LAYOUT.leftCol.width,
                        link: item.url,
                        underline: true
                    });
                y += 11;
            }
        });
    }
    
    return y + MARGINS.section;
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
    
    y = addSectionHeader(doc, 'Certifications', LAYOUT.leftCol.x, LAYOUT.leftCol.width, y);
    
    certs.forEach((cert, index) => {
        if (index > 0) y += 12;
        
        doc.fontSize(SIZES.body).fillColor(COLORS.primary).font(FONTS.bold)
            .text(cert.name, LAYOUT.leftCol.x, y, { width: LAYOUT.leftCol.width });
        y += 11;
        
        if (cert.provider) {
            doc.fontSize(SIZES.small).font(FONTS.regular).fillColor(COLORS.secondary)
                .text(cert.provider, LAYOUT.leftCol.x, y, { width: LAYOUT.leftCol.width });
            y += 10;
        }
        
        if (cert.dates) {
            doc.font(FONTS.italic).fillColor(COLORS.secondary)
                .text(cert.dates, LAYOUT.leftCol.x, y, { width: LAYOUT.leftCol.width });
            y += 10;
        }
    });
    
    return y + MARGINS.section;
}

function addEMRTraining(doc, data, y) {
    if (!data.emrRcmTraining || (!data.emrRcmTraining.emrSystems?.length && !data.emrRcmTraining.rcmTraining)) {
        return y;
    }
    
    y = addSectionHeader(doc, 'EMR/RCM Training', LAYOUT.leftCol.x, LAYOUT.leftCol.width, y);
    
    doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular);
    
    if (data.emrRcmTraining.emrSystems?.length) {
        doc.font(FONTS.bold).text('EMR Systems:', LAYOUT.leftCol.x, y, { width: LAYOUT.leftCol.width });
        y += 11;
        
        data.emrRcmTraining.emrSystems.forEach(system => {
            doc.font(FONTS.regular).text(`• ${system}`, LAYOUT.leftCol.x, y, { width: LAYOUT.leftCol.width });
            y += 10;
        });
    }
    
    if (data.emrRcmTraining.rcmTraining) {
        y += 5;
        doc.font(FONTS.bold).text('RCM Training', LAYOUT.leftCol.x, y, { width: LAYOUT.leftCol.width });
        y += 11;
        
        if (data.emrRcmTraining.duration) {
            doc.font(FONTS.regular).fillColor(COLORS.secondary)
                .text(`Duration: ${data.emrRcmTraining.duration}`, LAYOUT.leftCol.x, y, { width: LAYOUT.leftCol.width });
            y += 10;
        }
    }
    
    return y + MARGINS.section;
}

function addExperience(doc, experiences, title, y) {
    if (!experiences?.length) return y;
    
    y = addSectionHeader(doc, title, LAYOUT.rightCol.x, LAYOUT.rightCol.width, y);
    
    experiences.forEach((exp, index) => {
        if (index > 0) y += 15;
        
        const jobTitle = exp.title || exp.position || exp.role || '';
        const org = exp.hospital || exp.organization || '';
        
        if (jobTitle) {
            doc.fontSize(SIZES.subheading).fillColor(COLORS.primary).font(FONTS.bold)
                .text(jobTitle, LAYOUT.rightCol.x, y, { width: LAYOUT.rightCol.width });
            y += 13;
        }
        
        if (org) {
            doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular)
                .text(org, LAYOUT.rightCol.x, y, { width: LAYOUT.rightCol.width });
            y += 11;
        }
        
        const locationParts = [exp.city, exp.state, exp.country, exp.location].filter(Boolean);
        const dateStr = exp.duration || 
                       (exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}` : '');
        
        const info = [];
        if (locationParts.length) info.push(locationParts.join(', '));
        if (dateStr) info.push(dateStr);
        
        if (info.length) {
            doc.fillColor(COLORS.secondary).font(FONTS.italic)
                .text(info.join(' | '), LAYOUT.rightCol.x, y, { width: LAYOUT.rightCol.width });
            y += 11;
        }
        
        if (exp.supervisor) {
            doc.fillColor(COLORS.secondary).font(FONTS.italic)
                .text(`Supervisor: ${exp.supervisor}`, LAYOUT.rightCol.x, y, { width: LAYOUT.rightCol.width });
            y += 11;
        }
        
        if (exp.description) {
            y += 3;
            doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular);
            const lines = exp.description.split('\n').filter(l => l.trim());
            lines.forEach(line => {
                const text = `• ${line.trim()}`;
                doc.text(text, LAYOUT.rightCol.x, y, { width: LAYOUT.rightCol.width, align: 'left' });
                y += doc.heightOfString(text, { width: LAYOUT.rightCol.width }) + 2;
            });
        }
    });
    
    return y + MARGINS.section;
}

function addAchievements(doc, data, y) {
    const hasSignificant = data.significantAchievements?.trim();
    const hasArray = data.achievements?.length;
    
    if (!hasSignificant && !hasArray) return y;
    
    y = addSectionHeader(doc, 'Achievements', LAYOUT.rightCol.x, LAYOUT.rightCol.width, y);
    
    if (hasSignificant) {
        doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular);
        const lines = data.significantAchievements.split('\n').filter(l => l.trim());
        lines.forEach(line => {
            const text = `• ${line.trim()}`;
            doc.text(text, LAYOUT.rightCol.x, y, { width: LAYOUT.rightCol.width });
            y += doc.heightOfString(text, { width: LAYOUT.rightCol.width }) + 3;
        });
        y += 8;
    }
    
    if (hasArray) {
        data.achievements.forEach((achievement, index) => {
            if (index > 0 || hasSignificant) y += 10;
            
            doc.fontSize(SIZES.body).fillColor(COLORS.primary).font(FONTS.bold)
                .text(achievement.title, LAYOUT.rightCol.x, y, { width: LAYOUT.rightCol.width });
            y += 13;
            
            if (achievement.date) {
                doc.fontSize(SIZES.small).fillColor(COLORS.secondary).font(FONTS.italic)
                    .text(achievement.date, LAYOUT.rightCol.x, y);
                y += 11;
            }
            
            if (achievement.description) {
                doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular)
                    .text(achievement.description, LAYOUT.rightCol.x, y, { width: LAYOUT.rightCol.width });
                y += doc.heightOfString(achievement.description, { width: LAYOUT.rightCol.width }) + 5;
            }
            
            if (achievement.url?.trim()) {
                doc.fontSize(SIZES.small).fillColor(COLORS.accent).font(FONTS.regular)
                    .text('View Document', LAYOUT.rightCol.x, y, { 
                        width: LAYOUT.rightCol.width,
                        link: achievement.url,
                        underline: true
                    });
                y += 11;
            }
        });
    }
    
    return y + MARGINS.section;
}

function addPublications(doc, data, y) {
    if (!data.publications?.length) return y;
    
    y = addSectionHeader(doc, 'Publications', LAYOUT.rightCol.x, LAYOUT.rightCol.width, y);
    
    data.publications.forEach((pub, index) => {
        if (index > 0) y += 12;
        
        doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular);
        const title = `${index + 1}. ${pub.title}`;
        doc.text(title, LAYOUT.rightCol.x, y, { width: LAYOUT.rightCol.width });
        y += doc.heightOfString(title, { width: LAYOUT.rightCol.width }) + 2;
        
        const details = [pub.journal, pub.year];
        if (pub.type) details.push(`(${pub.type.replace('-', ' ')})`);
        
        doc.font(FONTS.italic).fillColor(COLORS.secondary)
            .text(details.join(', '), LAYOUT.rightCol.x, y, { width: LAYOUT.rightCol.width });
        y += 11;
        
        if (pub.supportingDocument?.url) {
            doc.fillColor(COLORS.accent).font(FONTS.regular)
                .text('View Publication', LAYOUT.rightCol.x, y, { 
                    width: LAYOUT.rightCol.width,
                    link: pub.supportingDocument.url,
                    underline: true
                });
            y += 11;
        }
    });
    
    return y + MARGINS.section;
}

function addConferences(doc, data, y) {
    if (!data.conferences?.length) return y;
    
    y = addSectionHeader(doc, 'Conferences', LAYOUT.rightCol.x, LAYOUT.rightCol.width, y);
    
    data.conferences.forEach((conf, index) => {
        if (index > 0) y += 15;
        
        doc.fontSize(SIZES.body).fillColor(COLORS.primary).font(FONTS.bold)
            .text(conf.name, LAYOUT.rightCol.x, y, { width: LAYOUT.rightCol.width });
        y += 13;
        
        const details = [conf.role, conf.year].filter(Boolean);
        if (details.length) {
            doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular)
                .text(details.join(' | '), LAYOUT.rightCol.x, y);
            y += 11;
        }
        
        const location = [conf.location, conf.country].filter(Boolean).join(', ');
        if (location) {
            doc.fillColor(COLORS.secondary).font(FONTS.italic)
                .text(location, LAYOUT.rightCol.x, y);
            y += 11;
        }
        
        if (conf.description) {
            doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular)
                .text(conf.description, LAYOUT.rightCol.x, y, { width: LAYOUT.rightCol.width });
            y += doc.heightOfString(conf.description, { width: LAYOUT.rightCol.width }) + 5;
        }
        
        if (conf.certificateAwarded) {
            doc.fillColor(COLORS.accent).font(FONTS.italic)
                .text('✓ Certificate Awarded', LAYOUT.rightCol.x, y);
            y += 11;
        }
        
        if (conf.supportingDocument?.url) {
            doc.fillColor(COLORS.accent).font(FONTS.regular)
                .text('View Certificate', LAYOUT.rightCol.x, y, { 
                    width: LAYOUT.rightCol.width,
                    link: conf.supportingDocument.url,
                    underline: true
                });
            y += 11;
        }
    });
    
    return y + MARGINS.section;
}

function addWorkshops(doc, data, y) {
    if (!data.workshops?.length) return y;
    
    y = addSectionHeader(doc, 'Workshops & Training', LAYOUT.rightCol.x, LAYOUT.rightCol.width, y);
    
    data.workshops.forEach((workshop, index) => {
        if (index > 0) y += 15;
        
        doc.fontSize(SIZES.body).fillColor(COLORS.primary).font(FONTS.bold)
            .text(workshop.name, LAYOUT.rightCol.x, y, { width: LAYOUT.rightCol.width });
        y += 13;
        
        const details = [workshop.organizer, workshop.year || workshop.date].filter(Boolean);
        if (details.length) {
            doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular)
                .text(details.join(' | '), LAYOUT.rightCol.x, y);
            y += 11;
        }
        
        if (workshop.description) {
            doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular)
                .text(workshop.description, LAYOUT.rightCol.x, y, { width: LAYOUT.rightCol.width });
            y += doc.heightOfString(workshop.description, { width: LAYOUT.rightCol.width }) + 5;
        }
        
        if (workshop.awards) {
            doc.fillColor(COLORS.accent).font(FONTS.italic)
                .text(`Awards: ${workshop.awards}`, LAYOUT.rightCol.x, y, { width: LAYOUT.rightCol.width });
            y += 11;
        }
    });
    
    return y + MARGINS.section;
}

export async function generateCVPDF(cvData) {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ 
                size: 'A4', 
                margins: MARGINS.page,
                bufferPages: true
            });
            
            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            
            let headerEndY = addHeader(doc, cvData);
            
            let leftY = headerEndY;
            let rightY = headerEndY;
            
            leftY = addEducation(doc, cvData, leftY);
            leftY = addLanguages(doc, cvData, leftY);
            leftY = addUSMLEScores(doc, cvData, leftY);
            leftY = addSkills(doc, cvData, leftY);
            leftY = addCertifications(doc, cvData, leftY);
            leftY = addEMRTraining(doc, cvData, leftY);
            
            rightY = addExperience(doc, cvData.usClinicalExperience?.list, 'US Clinical Experience', rightY);
            rightY = addExperience(doc, cvData.clinicalExperiences, 'Clinical Experience', rightY);
            rightY = addExperience(doc, cvData.workExperience, 'Work Experience', rightY);
            rightY = addExperience(doc, cvData.professionalExperiences, 'Professional Experience', rightY);
            rightY = addExperience(doc, cvData.volunteerExperiences, 'Volunteer Experience', rightY);
            rightY = addAchievements(doc, cvData, rightY);
            rightY = addPublications(doc, cvData, rightY);
            rightY = addConferences(doc, cvData, rightY);
            rightY = addWorkshops(doc, cvData, rightY);
            
            const pageCount = doc.bufferedPageRange().count;
            for (let i = 0; i < pageCount; i++) {
                doc.switchToPage(i);
                doc.fontSize(7).fillColor(COLORS.light)
                    .text(`${cvData.basicDetails.fullName} - Page ${i + 1}`, 
                          MARGINS.page.left, 
                          LAYOUT.pageHeight - 35, 
                          { 
                              align: 'center', 
                              width: LAYOUT.pageWidth - MARGINS.page.left - MARGINS.page.right 
                          });
            }
            
            doc.end();
            
        } catch (error) {
            reject(error);
        }
    });
}