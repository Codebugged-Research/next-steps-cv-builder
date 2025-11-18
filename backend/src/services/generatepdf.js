import PDFDocument from 'pdfkit';
import axios from 'axios';

const COLORS = {
    primary: '#000000',
    accent: '#0066cc',
    text: '#000000',
    darkGray: '#4a4a4a',
    lightGray: '#666666',
    sectionLine: '#cccccc'
};

const FONTS = {
    bold: 'Helvetica-Bold',
    regular: 'Helvetica',
    italic: 'Helvetica-Oblique'
};

const SIZES = {
    name: 20,
    contactInfo: 9,
    sectionHeading: 11,
    jobTitle: 10,
    body: 9,
    small: 8,
    lineHeight: 12
};

const MARGINS = {
    top: 40,
    bottom: 50,
    left: 50,
    right: 50
};

const LAYOUT = {
    leftColumnX: 50,
    leftColumnWidth: 180,
    rightColumnX: 240,
    rightColumnWidth: 315,
    pageHeight: 792
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

function addHeader(doc, data) {
    const { fullName, email, phone, city, address, nationality, gender } = data.basicDetails;
    
    doc.fontSize(SIZES.name).fillColor(COLORS.primary).font(FONTS.bold)
        .text(fullName.toUpperCase(), MARGINS.left, MARGINS.top);
    
    let contactY = MARGINS.top + 25;
    doc.fontSize(SIZES.contactInfo).fillColor(COLORS.darkGray).font(FONTS.regular);
    
    let contactLine1 = [];
    if (email) contactLine1.push(email);
    if (phone) contactLine1.push(phone);
    if (contactLine1.length > 0) {
        doc.text(contactLine1.join(' | '), MARGINS.left, contactY);
        contactY += 11;
    }
    
    if (address || city) {
        const addressParts = [];
        if (address) addressParts.push(address);
        if (city) addressParts.push(city);
        doc.text(addressParts.join(', '), MARGINS.left, contactY);
        contactY += 11;
    }
    
    const additionalInfo = [];
    if (nationality) additionalInfo.push(`Nationality: ${nationality}`);
    if (gender && gender !== 'prefer-not-to-say') additionalInfo.push(`Gender: ${gender.charAt(0).toUpperCase() + gender.slice(1)}`);
    if (additionalInfo.length > 0) {
        doc.text(additionalInfo.join(' | '), MARGINS.left, contactY);
        contactY += 11;
    }
    
    const medicalInfo = [];
    if (data.basicDetails.medicalSchool) medicalInfo.push(data.basicDetails.medicalSchool);
    if (data.basicDetails.mbbsRegNo) medicalInfo.push(`Reg No: ${data.basicDetails.mbbsRegNo}`);
    if (medicalInfo.length > 0) {
        doc.text(medicalInfo.join(' | '), MARGINS.left, contactY);
        contactY += 11;
    }
    
    if (data.basicDetails.usmleId) {
        doc.text(`USMLE ID: ${data.basicDetails.usmleId}`, MARGINS.left, contactY);
        contactY += 11;
    }
    
    return contactY + 20;
}

function addLeftColumnSection(doc, title, y) {
    y = checkPageBreak(doc, y, 30);
    
    doc.fontSize(SIZES.sectionHeading).fillColor(COLORS.primary).font(FONTS.bold)
        .text(title.toUpperCase(), LAYOUT.leftColumnX, y);
    
    const lineY = y + 14;
    doc.moveTo(LAYOUT.leftColumnX, lineY)
        .lineTo(LAYOUT.leftColumnX + LAYOUT.leftColumnWidth, lineY)
        .strokeColor(COLORS.sectionLine)
        .lineWidth(0.5)
        .stroke();
    
    return lineY + 8;
}

function addEducation(doc, data, startY) {
    let y = addLeftColumnSection(doc, 'Education', startY);
    
    const educationEntries = [];
    
    if (data.education?.postGraduation?.universityName) {
        const pg = data.education.postGraduation;
        educationEntries.push({
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
        educationEntries.push({
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
        educationEntries.push({
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
        educationEntries.push({
            degree: 'Secondary School',
            institution: school.schoolName,
            location: [school.city, school.state].filter(Boolean).join(', '),
            year: school.endYear,
            grade: school.grade
        });
    }
    
    educationEntries.forEach((entry, index) => {
        if (index > 0) y += 12;
        
        y = checkPageBreak(doc, y, 60);
        
        doc.fontSize(SIZES.body).fillColor(COLORS.primary).font(FONTS.bold)
            .text(entry.degree, LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
        y += SIZES.lineHeight;
        
        if (entry.specialization) {
            doc.fontSize(SIZES.small).fillColor(COLORS.accent).font(FONTS.italic)
                .text(entry.specialization, LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
            y += 10;
        }
        
        doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular)
            .text(entry.institution, LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
        y += 10;
        
        if (entry.location) {
            doc.fillColor(COLORS.darkGray).font(FONTS.italic)
                .text(entry.location, LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
            y += 10;
        }
        
        const detailsLine = [];
        if (entry.year) detailsLine.push(entry.year);
        if (entry.grade) detailsLine.push(entry.grade);
        if (entry.classType) detailsLine.push(entry.classType);
        if (entry.status) detailsLine.push(entry.status);
        
        if (detailsLine.length > 0) {
            doc.fillColor(COLORS.darkGray)
                .text(detailsLine.join(' | '), LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
            y += 10;
        }
    });
    
    return y + 15;
}

function addLanguages(doc, data, startY) {
    if (!data.basicDetails?.languages || data.basicDetails.languages.length === 0) return startY;
    
    let y = addLeftColumnSection(doc, 'Languages', startY);
    
    doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular);
    
    data.basicDetails.languages.forEach(lang => {
        y = checkPageBreak(doc, y, 25);
        
        const fluencyLevel = lang.fluency.charAt(0).toUpperCase() + lang.fluency.slice(1);
        doc.text(`• ${lang.language}`, LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
        y += 10;
        doc.fillColor(COLORS.darkGray).font(FONTS.italic)
            .text(`  ${fluencyLevel}`, LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
        y += 11;
        doc.font(FONTS.regular).fillColor(COLORS.text);
    });
    
    return y + 15;
}

function addSkillsSection(doc, data, startY) {
    if (!data.skills?.skillsList && (!data.skills?.supportingDocuments || data.skills.supportingDocuments.length === 0)) {
        return startY;
    }
    
    let y = addLeftColumnSection(doc, 'Skills', startY);
    
    if (data.skills?.skillsList) {
        doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular);
        const skills = data.skills.skillsList.split(',').map(s => s.trim()).filter(Boolean);
        
        skills.forEach(skill => {
            y = checkPageBreak(doc, y, 15);
            doc.text(`• ${skill}`, LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
            y += 11;
        });
    }
    
    if (data.skills?.supportingDocuments && data.skills.supportingDocuments.length > 0) {
        y += 5;
        y = checkPageBreak(doc, y, 30);
        
        doc.fontSize(SIZES.small).fillColor(COLORS.darkGray).font(FONTS.bold)
            .text('Documents:', LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
        y += 11;
        
        data.skills.supportingDocuments.forEach(docItem => {
            if (docItem.url) {
                y = checkPageBreak(doc, y, 15);
                doc.fontSize(SIZES.small).fillColor(COLORS.accent).font(FONTS.regular)
                    .text('View Document', LAYOUT.leftColumnX, y, { 
                        width: LAYOUT.leftColumnWidth,
                        link: docItem.url,
                        underline: true
                    });
                y += 11;
            }
        });
    }
    
    return y + 15;
}

function addUSMLEScores(doc, data, startY) {
    if (!data.usmleScores) return startY;
    
    const hasUSMLEInfo = data.usmleScores.step1Status !== 'not-taken' || 
                         data.usmleScores.step2ckScore || 
                         data.usmleScores.step2csStatus !== 'not-taken' ||
                         data.usmleScores.oetScore ||
                         data.usmleScores.ecfmgCertified;
    
    if (!hasUSMLEInfo) return startY;
    
    let y = addLeftColumnSection(doc, 'USMLE Scores', startY);
    
    doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular);
    
    if (data.usmleScores.step1Status && data.usmleScores.step1Status !== 'not-taken') {
        y = checkPageBreak(doc, y, 25);
        doc.font(FONTS.bold).text('Step 1:', LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth, continued: true })
           .font(FONTS.regular).text(` ${data.usmleScores.step1Status.toUpperCase()}`);
        y += 11;
        
        if (data.usmleScores.step1Cert?.url) {
            doc.fontSize(SIZES.small).fillColor(COLORS.accent).font(FONTS.regular)
                .text('View Document', LAYOUT.leftColumnX + 10, y, { 
                    width: LAYOUT.leftColumnWidth - 10,
                    link: data.usmleScores.step1Cert.url,
                    underline: true
                });
            y += 11;
        }
    }
    
    if (data.usmleScores.step2ckScore) {
        y = checkPageBreak(doc, y, 25);
        doc.fillColor(COLORS.text).font(FONTS.bold).text('Step 2 CK:', LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth, continued: true })
           .font(FONTS.regular).text(` ${data.usmleScores.step2ckScore}`);
        y += 11;
        
        if (data.usmleScores.step2Cert?.url) {
            doc.fontSize(SIZES.small).fillColor(COLORS.accent).font(FONTS.regular)
                .text('View Document', LAYOUT.leftColumnX + 10, y, { 
                    width: LAYOUT.leftColumnWidth - 10,
                    link: data.usmleScores.step2Cert.url,
                    underline: true
                });
            y += 11;
        }
    }
    
    if (data.usmleScores.step2csStatus && data.usmleScores.step2csStatus !== 'not-taken') {
        y = checkPageBreak(doc, y, 15);
        doc.fillColor(COLORS.text).font(FONTS.bold).text('Step 2 CS:', LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth, continued: true })
           .font(FONTS.regular).text(` ${data.usmleScores.step2csStatus.toUpperCase()}`);
        y += 11;
    }
    
    if (data.usmleScores.oetScore) {
        y = checkPageBreak(doc, y, 25);
        doc.fillColor(COLORS.text).font(FONTS.bold).text('OET Score:', LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth, continued: true })
           .font(FONTS.regular).text(` ${data.usmleScores.oetScore}`);
        y += 11;
        
        if (data.usmleScores.oetCert?.url) {
            doc.fontSize(SIZES.small).fillColor(COLORS.accent).font(FONTS.regular)
                .text('View Document', LAYOUT.leftColumnX + 10, y, { 
                    width: LAYOUT.leftColumnWidth - 10,
                    link: data.usmleScores.oetCert.url,
                    underline: true
                });
            y += 11;
        }
    }
    
    if (data.usmleScores.ecfmgCertified) {
        y = checkPageBreak(doc, y, 15);
        doc.font(FONTS.bold).fillColor(COLORS.accent)
           .text('✓ ECFMG Certified', LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
        y += 11;
    }
    
    return y + 15;
}

function addCertifications(doc, data, startY) {
    const certs = [];
    
    if (data.aclsBls?.aclsCertified) {
        certs.push({ 
            name: 'ACLS', 
            issueDate: data.aclsBls.aclsIssueDate,
            expiryDate: data.aclsBls.aclsExpiryDate,
            provider: data.aclsBls.aclsProvider
        });
    }
    if (data.aclsBls?.blsCertified) {
        certs.push({ 
            name: 'BLS', 
            issueDate: data.aclsBls.blsIssueDate,
            expiryDate: data.aclsBls.blsExpiryDate,
            provider: data.aclsBls.blsProvider
        });
    }
    
    if (certs.length === 0) return startY;
    
    let y = addLeftColumnSection(doc, 'Certifications', startY);
    
    doc.fontSize(SIZES.small).fillColor(COLORS.text);
    
    certs.forEach(cert => {
        y = checkPageBreak(doc, y, 40);
        
        doc.font(FONTS.bold).text(cert.name, LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
        y += 11;
        
        if (cert.provider) {
            doc.font(FONTS.regular).fillColor(COLORS.darkGray)
                .text(cert.provider, LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
            y += 10;
        }
        
        if (cert.issueDate && cert.expiryDate) {
            doc.font(FONTS.italic).fillColor(COLORS.darkGray)
                .text(`${cert.issueDate} - ${cert.expiryDate}`, LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
            y += 10;
        } else if (cert.expiryDate) {
            doc.font(FONTS.italic).fillColor(COLORS.darkGray)
                .text(`Expires: ${cert.expiryDate}`, LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
            y += 10;
        }
        
        y += 5;
    });
    
    return y + 10;
}

function addEMRTraining(doc, data, startY) {
    if (!data.emrRcmTraining || 
        (!data.emrRcmTraining.emrSystems?.length && !data.emrRcmTraining.rcmTraining)) {
        return startY;
    }
    
    let y = addLeftColumnSection(doc, 'EMR/RCM Training', startY);
    
    doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular);
    
    if (data.emrRcmTraining.emrSystems && data.emrRcmTraining.emrSystems.length > 0) {
        y = checkPageBreak(doc, y, 30);
        
        doc.font(FONTS.bold).text('EMR Systems:', LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
        y += 11;
        
        data.emrRcmTraining.emrSystems.forEach(system => {
            y = checkPageBreak(doc, y, 15);
            doc.font(FONTS.regular).text(`• ${system}`, LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
            y += 10;
        });
        y += 5;
    }
    
    if (data.emrRcmTraining.rcmTraining) {
        y = checkPageBreak(doc, y, 25);
        
        doc.font(FONTS.bold).text('RCM Training', LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
        y += 11;
        
        if (data.emrRcmTraining.duration) {
            doc.font(FONTS.regular).fillColor(COLORS.darkGray)
                .text(`Duration: ${data.emrRcmTraining.duration}`, LAYOUT.leftColumnX, y, { width: LAYOUT.leftColumnWidth });
            y += 10;
        }
    }
    
    return y + 15;
}

function addRightColumnSection(doc, title, y) {
    y = checkPageBreak(doc, y, 30);
    
    doc.fontSize(SIZES.sectionHeading).fillColor(COLORS.primary).font(FONTS.bold)
        .text(title.toUpperCase(), LAYOUT.rightColumnX, y);
    
    const lineY = y + 14;
    doc.moveTo(LAYOUT.rightColumnX, lineY)
        .lineTo(doc.page.width - MARGINS.right, lineY)
        .strokeColor(COLORS.sectionLine)
        .lineWidth(0.5)
        .stroke();
    
    return lineY + 8;
}

function addExperienceSection(doc, experiences, title, startY) {
    if (!experiences || experiences.length === 0) return startY;
    
    let y = addRightColumnSection(doc, title, startY);
    
    experiences.forEach((exp, index) => {
        if (index > 0) y += 15;
        
        y = checkPageBreak(doc, y, 80);
        
        const titleText = exp.title || exp.position || exp.role || '';
        const orgText = exp.hospital || exp.organization || '';
        
        if (titleText) {
            doc.fontSize(SIZES.jobTitle).fillColor(COLORS.primary).font(FONTS.bold)
                .text(titleText, LAYOUT.rightColumnX, y, { width: LAYOUT.rightColumnWidth });
            y += SIZES.lineHeight;
        }
        
        if (orgText) {
            doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular)
                .text(orgText, LAYOUT.rightColumnX, y, { width: LAYOUT.rightColumnWidth });
            y += 10;
        }
        
        const locationParts = [];
        if (exp.city) locationParts.push(exp.city);
        if (exp.state) locationParts.push(exp.state);
        if (exp.country) locationParts.push(exp.country);
        if (exp.location) locationParts.push(exp.location);
        
        const dateStr = exp.duration || 
                       (exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}` : '');
        
        if (locationParts.length > 0 || dateStr) {
            doc.fillColor(COLORS.darkGray).font(FONTS.italic);
            const infoLine = [];
            if (locationParts.length > 0) infoLine.push(locationParts.join(', '));
            if (dateStr) infoLine.push(dateStr);
            doc.text(infoLine.join(' | '), LAYOUT.rightColumnX, y, { width: LAYOUT.rightColumnWidth });
            y += 10;
        }
        
        if (exp.supervisor) {
            doc.fillColor(COLORS.darkGray).font(FONTS.italic)
                .text(`Supervisor: ${exp.supervisor}`, LAYOUT.rightColumnX, y, { width: LAYOUT.rightColumnWidth });
            y += 10;
        }
        
        if (exp.description) {
            y += 3;
            doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular);
            const lines = exp.description.split('\n').filter(l => l.trim());
            lines.forEach(line => {
                const lineHeight = doc.heightOfString(line, { width: LAYOUT.rightColumnWidth });
                y = checkPageBreak(doc, y, lineHeight + 5);
                
                doc.text(`• ${line.trim()}`, LAYOUT.rightColumnX, y, { 
                    width: LAYOUT.rightColumnWidth,
                    align: 'left'
                });
                y += lineHeight + 2;
            });
        }
    });
    
    return y + 10;
}

function addAchievements(doc, data, startY) {
    const hasSignificant = data.significantAchievements?.trim();
    const hasAchievements = data.achievements && data.achievements.length > 0;
    
    if (!hasSignificant && !hasAchievements) return startY;
    
    let y = addRightColumnSection(doc, 'Achievements', startY);
    
    if (hasSignificant) {
        doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular);
        const lines = data.significantAchievements.split('\n').filter(l => l.trim());
        lines.forEach(line => {
            const lineHeight = doc.heightOfString(line, { width: LAYOUT.rightColumnWidth });
            y = checkPageBreak(doc, y, lineHeight + 5);
            
            doc.text(`• ${line.trim()}`, LAYOUT.rightColumnX, y, {
                width: LAYOUT.rightColumnWidth
            });
            y += lineHeight + 3;
        });
        y += 8;
    }
    
    if (hasAchievements) {
        data.achievements.forEach((achievement, index) => {
            y = checkPageBreak(doc, y, 60);
            
            doc.fontSize(SIZES.body).fillColor(COLORS.primary).font(FONTS.bold)
                .text(achievement.title, LAYOUT.rightColumnX, y, { width: LAYOUT.rightColumnWidth });
            y += SIZES.lineHeight;
            
            if (achievement.date) {
                doc.fontSize(SIZES.small).fillColor(COLORS.darkGray).font(FONTS.italic)
                    .text(achievement.date, LAYOUT.rightColumnX, y);
                y += 10;
            }
            
            if (achievement.description) {
                const descHeight = doc.heightOfString(achievement.description, { width: LAYOUT.rightColumnWidth });
                doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular)
                    .text(achievement.description, LAYOUT.rightColumnX, y, { width: LAYOUT.rightColumnWidth });
                y += descHeight + 5;
            }
            
            if (achievement.url && achievement.url.trim()) {
                doc.fontSize(SIZES.small).fillColor(COLORS.accent).font(FONTS.regular)
                    .text('View Document', LAYOUT.rightColumnX, y, { 
                        width: LAYOUT.rightColumnWidth,
                        link: achievement.url,
                        underline: true
                    });
                y += 10;
            }
            
            if (index < data.achievements.length - 1) y += 8;
        });
    }
    
    return y + 10;
}

function addPublications(doc, data, startY) {
    if (!data.publications || data.publications.length === 0) return startY;
    
    let y = addRightColumnSection(doc, 'Publications', startY);
    
    data.publications.forEach((pub, index) => {
        if (index > 0) y += 10;
        
        y = checkPageBreak(doc, y, 50);
        
        doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular);
        const titleHeight = doc.heightOfString(pub.title, { width: LAYOUT.rightColumnWidth });
        doc.text(`${index + 1}. ${pub.title}`, LAYOUT.rightColumnX, y, {
            width: LAYOUT.rightColumnWidth
        });
        y += titleHeight + 2;
        
        doc.font(FONTS.italic).fillColor(COLORS.darkGray);
        const pubDetails = [pub.journal, pub.year];
        if (pub.type) pubDetails.push(`(${pub.type.replace('-', ' ')})`);
        doc.text(pubDetails.join(', '), LAYOUT.rightColumnX, y, { width: LAYOUT.rightColumnWidth });
        y += 10;
        
        if (pub.supportingDocument?.url) {
            doc.fillColor(COLORS.accent).font(FONTS.regular)
                .text('View Document', LAYOUT.rightColumnX, y, { 
                    width: LAYOUT.rightColumnWidth,
                    link: pub.supportingDocument.url,
                    underline: true
                });
            y += 11;
        }
    });
    
    return y + 10;
}

function addConferences(doc, data, startY) {
    if (!data.conferences || data.conferences.length === 0) return startY;
    
    let y = addRightColumnSection(doc, 'Conferences', startY);
    
    data.conferences.forEach((conf, index) => {
        if (index > 0) y += 12;
        
        y = checkPageBreak(doc, y, 80);
        
        doc.fontSize(SIZES.body).fillColor(COLORS.primary).font(FONTS.bold)
            .text(conf.name, LAYOUT.rightColumnX, y, { width: LAYOUT.rightColumnWidth });
        y += SIZES.lineHeight;
        
        const confDetails = [];
        if (conf.role) confDetails.push(conf.role);
        if (conf.year) confDetails.push(conf.year);
        
        if (confDetails.length > 0) {
            doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular)
                .text(confDetails.join(' | '), LAYOUT.rightColumnX, y);
            y += 10;
        }
        
        const location = [conf.location, conf.country].filter(Boolean).join(', ');
        if (location) {
            doc.fillColor(COLORS.darkGray).font(FONTS.italic)
                .text(location, LAYOUT.rightColumnX, y);
            y += 10;
        }
        
        if (conf.description) {
            const descHeight = doc.heightOfString(conf.description, { width: LAYOUT.rightColumnWidth });
            doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular)
                .text(conf.description, LAYOUT.rightColumnX, y, { width: LAYOUT.rightColumnWidth });
            y += descHeight + 5;
        }
        
        if (conf.certificateAwarded) {
            doc.fillColor(COLORS.accent).font(FONTS.italic)
                .text('✓ Certificate Awarded', LAYOUT.rightColumnX, y);
            y += 10;
        }
        
        if (conf.supportingDocument?.url) {
            doc.fillColor(COLORS.accent).font(FONTS.regular)
                .text('View Document', LAYOUT.rightColumnX, y, { 
                    width: LAYOUT.rightColumnWidth,
                    link: conf.supportingDocument.url,
                    underline: true
                });
            y += 11;
        }
    });
    
    return y + 10;
}

function addWorkshops(doc, data, startY) {
    if (!data.workshops || data.workshops.length === 0) return startY;
    
    let y = addRightColumnSection(doc, 'Workshops & Training', startY);
    
    data.workshops.forEach((workshop, index) => {
        if (index > 0) y += 12;
        
        y = checkPageBreak(doc, y, 60);
        
        doc.fontSize(SIZES.body).fillColor(COLORS.primary).font(FONTS.bold)
            .text(workshop.name, LAYOUT.rightColumnX, y, { width: LAYOUT.rightColumnWidth });
        y += SIZES.lineHeight;
        
        const workshopDetails = [];
        if (workshop.organizer) workshopDetails.push(workshop.organizer);
        if (workshop.year || workshop.date) workshopDetails.push(workshop.year || workshop.date);
        
        if (workshopDetails.length > 0) {
            doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular)
                .text(workshopDetails.join(' | '), LAYOUT.rightColumnX, y);
            y += 10;
        }
        
        if (workshop.description) {
            const descHeight = doc.heightOfString(workshop.description, { width: LAYOUT.rightColumnWidth });
            doc.fontSize(SIZES.small).fillColor(COLORS.text).font(FONTS.regular)
                .text(workshop.description, LAYOUT.rightColumnX, y, { width: LAYOUT.rightColumnWidth });
            y += descHeight + 5;
        }
        
        if (workshop.awards) {
            doc.fillColor(COLORS.accent).font(FONTS.italic)
                .text(`Awards: ${workshop.awards}`, LAYOUT.rightColumnX, y, { width: LAYOUT.rightColumnWidth });
            y += 10;
        }
    });
    
    return y + 10;
}

export async function generateCVPDF(cvData) {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ 
                size: 'A4', 
                margins: { 
                    top: MARGINS.top, 
                    bottom: MARGINS.bottom, 
                    left: MARGINS.left, 
                    right: MARGINS.right 
                },
                bufferPages: true
            });
            
            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            
            let headerEndY = addHeader(doc, cvData);
            
            let leftY = headerEndY + 10;
            let rightY = headerEndY + 10;
            
            leftY = addEducation(doc, cvData, leftY);
            leftY = addLanguages(doc, cvData, leftY);
            leftY = addUSMLEScores(doc, cvData, leftY);
            leftY = addSkillsSection(doc, cvData, leftY);
            leftY = addCertifications(doc, cvData, leftY);
            leftY = addEMRTraining(doc, cvData, leftY);
            
            rightY = addExperienceSection(doc, cvData.usClinicalExperience?.list, 'US Clinical Experience', rightY);
            rightY = addExperienceSection(doc, cvData.clinicalExperiences, 'Clinical Experience', rightY);
            rightY = addExperienceSection(doc, cvData.workExperience, 'Work Experience', rightY);
            rightY = addExperienceSection(doc, cvData.professionalExperiences, 'Professional Experience', rightY);
            rightY = addExperienceSection(doc, cvData.volunteerExperiences, 'Volunteer Experience', rightY);
            rightY = addAchievements(doc, cvData, rightY);
            rightY = addPublications(doc, cvData, rightY);
            rightY = addConferences(doc, cvData, rightY);
            rightY = addWorkshops(doc, cvData, rightY);
            
            const pageCount = doc.bufferedPageRange().count;
            for (let i = 0; i < pageCount; i++) {
                doc.switchToPage(i);
                doc.fontSize(7).fillColor(COLORS.lightGray).text(
                    `${cvData.basicDetails.fullName} - Page ${i + 1}`,
                    MARGINS.left,
                    doc.page.height - 30,
                    { align: 'center', width: doc.page.width - MARGINS.left - MARGINS.right }
                );
            }
            
            doc.end();
            
        } catch (error) {
            reject(error);
        }
    });
}