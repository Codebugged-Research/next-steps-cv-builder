import PDFDocument from 'pdfkit';
import axios from 'axios';
import { PDF_CONSTANTS } from '../constants/pdfConstants.js';

const { COLORS, FONTS, SIZES, MARGINS, PAGE_LIMITS } = PDF_CONSTANTS;

async function fetchImageBuffer(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
}

function addHeader(doc, data) {
    const { fullName, email, phone, city, nationality } = data.basicDetails;
    
    doc.fontSize(SIZES.heading).fillColor(COLORS.primary).font(FONTS.bold).text(fullName, MARGINS.left, MARGINS.top);
    
    const contactY = MARGINS.top + 30;
    doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular);
    doc.text(`${email} | ${phone} | ${city}${nationality ? ` | ${nationality}` : ''}`, MARGINS.left, contactY);
    
    return MARGINS.top + 60;
}

async function addPhotoToHeader(doc, photoUrl) {
    try {
        const imageBuffer = await fetchImageBuffer(photoUrl);
        doc.image(imageBuffer, PAGE_LIMITS.photoX, MARGINS.top, { 
            width: PAGE_LIMITS.photoSize, 
            height: PAGE_LIMITS.photoSize, 
            align: 'right' 
        });
    } catch (error) {
        console.error('Photo fetch error:', error.message);
    }
}

function addSection(doc, title, currentY) {
    if (currentY > PAGE_LIMITS.pageBreakY) {
        doc.addPage();
        currentY = MARGINS.top;
    }
    
    doc.fontSize(SIZES.section).fillColor(COLORS.accent).font(FONTS.bold).text(title, MARGINS.left, currentY);
    doc.moveTo(MARGINS.left, currentY + 18).lineTo(PAGE_LIMITS.lineEndX, currentY + 18).stroke(COLORS.accent);
    
    return currentY + 28;
}

function addBasicInfo(doc, data, startY) {
    let y = addSection(doc, 'PERSONAL INFORMATION', startY);
    
    doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular);
    
    const info = [];
    if (data.basicDetails.gender) info.push(`Gender: ${data.basicDetails.gender}`);
    if (data.basicDetails.medicalSchool) info.push(`Medical School: ${data.basicDetails.medicalSchool}`);
    if (data.basicDetails.graduationYear) info.push(`Graduation Year: ${data.basicDetails.graduationYear}`);
    if (data.basicDetails.mbbsRegNo) info.push(`MBBS Reg No: ${data.basicDetails.mbbsRegNo}`);
    if (data.basicDetails.usmleId) info.push(`USMLE ID: ${data.basicDetails.usmleId}`);
    
    info.forEach(item => {
        doc.text(item, MARGINS.left, y);
        y += SIZES.lineHeight;
    });
    
    if (data.basicDetails.languages?.length) {
        y += 5;
        doc.font(FONTS.bold).text('Languages:', MARGINS.left, y);
        y += SIZES.lineHeight;
        data.basicDetails.languages.forEach(lang => {
            doc.font(FONTS.regular).text(`${lang.language} (${lang.fluency})`, MARGINS.indent, y);
            y += SIZES.lineHeight;
        });
    }
    
    return y + 10;
}

function addEducation(doc, data, startY) {
    let y = addSection(doc, 'EDUCATION', startY);
    
    doc.fontSize(SIZES.body).fillColor(COLORS.text);
    
    if (data.education.graduation?.universityName) {
        const grad = data.education.graduation;
        doc.font(FONTS.bold).text(`${grad.degree || 'Graduation'}${grad.specialization ? ` - ${grad.specialization}` : ''}`, MARGINS.left, y);
        y += SIZES.lineHeight;
        doc.font(FONTS.regular).text(grad.universityName, MARGINS.left, y);
        if (grad.city || grad.state || grad.country) {
            doc.text(`${grad.city || ''}, ${grad.state || ''}, ${grad.country || ''}`, MARGINS.left, y + 12);
            y += 12;
        }
        if (grad.startDate || grad.endDate) {
            doc.fillColor(COLORS.darkGray).text(`${grad.startDate || ''} - ${grad.endDate || ''}`, MARGINS.left, y + 12);
            y += 12;
        }
        if (grad.overallGrade) {
            doc.fillColor(COLORS.text).text(`Grade: ${grad.overallGrade}${grad.classType ? ` (${grad.classType})` : ''}`, MARGINS.left, y + 12);
            y += 12;
        }
        y += 20;
    }
    
    if (data.education.postGraduation?.universityName) {
        const pg = data.education.postGraduation;
        doc.font(FONTS.bold).fillColor(COLORS.text).text(`${pg.degree || 'Post Graduation'}${pg.specialization ? ` - ${pg.specialization}` : ''}`, MARGINS.left, y);
        y += SIZES.lineHeight;
        doc.font(FONTS.regular).text(pg.universityName, MARGINS.left, y);
        if (pg.city || pg.state || pg.country) {
            doc.text(`${pg.city || ''}, ${pg.state || ''}, ${pg.country || ''}`, MARGINS.left, y + 12);
            y += 12;
        }
        if (pg.startDate || pg.endDate) {
            doc.fillColor(COLORS.darkGray).text(`${pg.startDate || ''} - ${pg.endDate || ''}${pg.status ? ` (${pg.status})` : ''}`, MARGINS.left, y + 12);
            y += 12;
        }
        y += 20;
    }
    
    if (data.education.college?.collegeName) {
        const col = data.education.college;
        doc.font(FONTS.bold).fillColor(COLORS.text).text(`Intermediate/+2${col.stream ? ` - ${col.stream}` : ''}`, MARGINS.left, y);
        y += SIZES.lineHeight;
        doc.font(FONTS.regular).text(col.collegeName, MARGINS.left, y);
        if (col.city || col.state) {
            doc.text(`${col.city || ''}, ${col.state || ''}`, MARGINS.left, y + 12);
            y += 12;
        }
        y += 20;
    }
    
    if (data.education.schooling?.schoolName) {
        const sch = data.education.schooling;
        doc.font(FONTS.bold).fillColor(COLORS.text).text('High School', MARGINS.left, y);
        y += SIZES.lineHeight;
        doc.font(FONTS.regular).text(sch.schoolName, MARGINS.left, y);
        if (sch.city || sch.state) {
            doc.text(`${sch.city || ''}, ${sch.state || ''}`, MARGINS.left, y + 12);
            y += 12;
        }
        y += 20;
    }
    
    return y + 10;
}

function addUSMLEScores(doc, data, startY) {
    if (!data.usmleScores?.step1Status && !data.usmleScores?.step2ckScore) return startY;
    
    let y = addSection(doc, 'USMLE SCORES', startY);
    
    doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular);
    
    if (data.usmleScores.step1Status && data.usmleScores.step1Status !== 'not-taken') {
        doc.text(`Step 1: ${data.usmleScores.step1Status.toUpperCase()}`, MARGINS.left, y);
        if (data.usmleScores.step1Cert?.url) {
            doc.fillColor(COLORS.accent).text('Certificate', 200, y, { link: data.usmleScores.step1Cert.url, underline: true });
        }
        y += SIZES.lineHeight;
    }
    
    if (data.usmleScores.step2ckScore) {
        doc.fillColor(COLORS.text).text(`Step 2 CK: ${data.usmleScores.step2ckScore}`, MARGINS.left, y);
        if (data.usmleScores.step2Cert?.url) {
            doc.fillColor(COLORS.accent).text('Certificate', 200, y, { link: data.usmleScores.step2Cert.url, underline: true });
        }
        y += SIZES.lineHeight;
    }
    
    if (data.usmleScores.step2csStatus && data.usmleScores.step2csStatus !== 'not-taken') {
        doc.fillColor(COLORS.text).text(`Step 2 CS: ${data.usmleScores.step2csStatus.toUpperCase()}`, MARGINS.left, y);
        y += SIZES.lineHeight;
    }
    
    if (data.usmleScores.ecfmgCertified) {
        doc.text('ECFMG Certified: Yes', MARGINS.left, y);
        y += SIZES.lineHeight;
    }
    
    return y + 10;
}

function addExperienceSection(doc, experiences, title, startY) {
    if (!experiences?.length) return startY;
    
    let y = addSection(doc, title, startY);
    
    doc.fontSize(SIZES.body).fillColor(COLORS.text);
    
    experiences.forEach((exp) => {
        if (y > PAGE_LIMITS.pageBreakY) {
            doc.addPage();
            y = MARGINS.top;
        }
        
        const titleText = exp.title || exp.position || exp.role || 'Position';
        const orgText = exp.hospital || exp.organization || '';
        
        doc.font(FONTS.bold).text(titleText, MARGINS.left, y);
        if (orgText) {
            doc.font(FONTS.regular).text(orgText, 300, y);
        }
        y += SIZES.lineHeight;
        
        if (exp.duration) {
            doc.fillColor(COLORS.darkGray).font(FONTS.italic).text(exp.duration, MARGINS.left, y);
            y += 12;
        }
        
        if (exp.description) {
            doc.fillColor(COLORS.text).font(FONTS.regular).text(exp.description, MARGINS.left, y, { width: PAGE_LIMITS.contentWidth, align: 'justify' });
            y += doc.heightOfString(exp.description, { width: PAGE_LIMITS.contentWidth }) + 5;
        }
        
        y += SIZES.lineHeight;
    });
    
    return y + 10;
}

function addPublications(doc, data, startY) {
    if (!data.publications?.length) return startY;
    
    let y = addSection(doc, 'PUBLICATIONS', startY);
    
    doc.fontSize(SIZES.body).fillColor(COLORS.text);
    
    data.publications.forEach((pub, index) => {
        if (y > PAGE_LIMITS.pageBreakY) {
            doc.addPage();
            y = MARGINS.top;
        }
        
        doc.font(FONTS.bold).text(`${index + 1}. ${pub.title}`, MARGINS.left, y);
        y += SIZES.lineHeight;
        
        doc.font(FONTS.italic).text(`${pub.journal}, ${pub.year}`, MARGINS.indent, y);
        y += 12;
        
        doc.font(FONTS.regular).text(`Type: ${pub.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`, MARGINS.indent, y);
        y += 12;
        
        if (pub.supportingDocument?.url) {
            doc.fillColor(COLORS.accent).text('View Document', MARGINS.indent, y, { link: pub.supportingDocument.url, underline: true });
            y += 12;
        }
        
        y += SIZES.lineHeight;
    });
    
    return y + 10;
}

function addConferences(doc, data, startY) {
    if (!data.conferences?.length) return startY;
    
    let y = addSection(doc, 'CONFERENCES', startY);
    
    doc.fontSize(SIZES.body).fillColor(COLORS.text);
    
    data.conferences.forEach((conf) => {
        if (y > PAGE_LIMITS.pageBreakY) {
            doc.addPage();
            y = MARGINS.top;
        }
        
        doc.font(FONTS.bold).text(conf.name, MARGINS.left, y);
        y += SIZES.lineHeight;
        
        doc.font(FONTS.regular).text(`Role: ${conf.role} | Year: ${conf.year}`, MARGINS.indent, y);
        y += 12;
        
        if (conf.location || conf.country) {
            doc.text(`Location: ${conf.location || ''}${conf.country ? `, ${conf.country}` : ''}`, MARGINS.indent, y);
            y += 12;
        }
        
        if (conf.description) {
            doc.text(conf.description, MARGINS.indent, y, { width: PAGE_LIMITS.indentWidth });
            y += doc.heightOfString(conf.description, { width: PAGE_LIMITS.indentWidth }) + 5;
        }
        
        if (conf.certificateAwarded) {
            doc.text('Certificate Awarded: Yes', MARGINS.indent, y);
            y += 12;
        }
        
        if (conf.supportingDocument?.url) {
            doc.fillColor(COLORS.accent).text('View Document', MARGINS.indent, y, { link: conf.supportingDocument.url, underline: true });
            y += 12;
        }
        
        y += SIZES.lineHeight;
    });
    
    return y + 10;
}

function addAchievements(doc, data, startY) {
    if (!data.achievements?.length && !data.significantAchievements) return startY;
    
    let y = addSection(doc, 'ACHIEVEMENTS', startY);
    
    doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular);
    
    if (data.significantAchievements) {
        doc.text(data.significantAchievements, MARGINS.left, y, { width: PAGE_LIMITS.contentWidth, align: 'justify' });
        y += doc.heightOfString(data.significantAchievements, { width: PAGE_LIMITS.contentWidth }) + SIZES.lineHeight;
    }
    
    if (data.achievements?.length) {
        data.achievements.forEach((ach) => {
            if (y > PAGE_LIMITS.pageBreakY) {
                doc.addPage();
                y = MARGINS.top;
            }
            
            doc.font(FONTS.bold).text(`• ${ach.title}`, MARGINS.left, y);
            y += SIZES.lineHeight;
            
            if (ach.description) {
                doc.font(FONTS.regular).text(ach.description, MARGINS.indent, y, { width: PAGE_LIMITS.indentWidth });
                y += doc.heightOfString(ach.description, { width: PAGE_LIMITS.indentWidth }) + 5;
            }
            
            if (ach.date) {
                doc.fillColor(COLORS.darkGray).font(FONTS.italic).text(ach.date, MARGINS.indent, y);
                y += 12;
            }
            
            if (ach.url && ach.attachmentType === 'url') {
                doc.fillColor(COLORS.accent).font(FONTS.regular).text('Link', MARGINS.indent, y, { link: ach.url, underline: true });
                y += 12;
            }
            
            y += 10;
        });
    }
    
    return y + 10;
}

function addSkills(doc, data, startY) {
    if (!data.skills?.skillsList) return startY;
    
    let y = addSection(doc, 'SKILLS', startY);
    
    doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular);
    doc.text(data.skills.skillsList, MARGINS.left, y, { width: PAGE_LIMITS.contentWidth, align: 'justify' });
    y += doc.heightOfString(data.skills.skillsList, { width: PAGE_LIMITS.contentWidth }) + 10;
    
    if (data.skills.supportingDocuments?.length) {
        y += 5;
        doc.font(FONTS.bold).text('Supporting Documents:', MARGINS.left, y);
        y += SIZES.lineHeight;
        
        data.skills.supportingDocuments.forEach((doc_item, index) => {
            doc.fillColor(COLORS.accent).font(FONTS.regular).text(`${index + 1}. ${doc_item.name}`, MARGINS.indent, y, { link: doc_item.url, underline: true });
            y += SIZES.lineHeight;
        });
    }
    
    return y + 10;
}

function addEMRTraining(doc, data, startY) {
    if (!data.emrRcmTraining?.emrSystems?.length && !data.emrRcmTraining?.rcmTraining) return startY;
    
    let y = addSection(doc, 'EMR/RCM TRAINING', startY);
    
    doc.fontSize(SIZES.body).fillColor(COLORS.text).font(FONTS.regular);
    
    if (data.emrRcmTraining.emrSystems?.length) {
        doc.text(`EMR Systems: ${data.emrRcmTraining.emrSystems.join(', ')}`, MARGINS.left, y);
        y += SIZES.lineHeight;
    }
    
    if (data.emrRcmTraining.rcmTraining) {
        doc.text(`RCM Training: Yes${data.emrRcmTraining.duration ? ` (${data.emrRcmTraining.duration})` : ''}`, MARGINS.left, y);
        y += SIZES.lineHeight;
    }
    
    return y + 10;
}

function addWorkshops(doc, data, startY) {
    if (!data.workshops?.length) return startY;
    
    let y = addSection(doc, 'WORKSHOPS & TRAINING', startY);
    
    doc.fontSize(SIZES.body).fillColor(COLORS.text);
    
    data.workshops.forEach((workshop) => {
        if (y > PAGE_LIMITS.pageBreakY) {
            doc.addPage();
            y = MARGINS.top;
        }
        
        doc.font(FONTS.bold).text(workshop.name, MARGINS.left, y);
        y += SIZES.lineHeight;
        
        if (workshop.organizer) {
            doc.font(FONTS.regular).text(`Organizer: ${workshop.organizer}`, MARGINS.indent, y);
            y += 12;
        }
        
        if (workshop.year || workshop.date) {
            doc.text(`${workshop.year || workshop.date}`, MARGINS.indent, y);
            y += 12;
        }
        
        if (workshop.description) {
            doc.text(workshop.description, MARGINS.indent, y, { width: PAGE_LIMITS.indentWidth });
            y += doc.heightOfString(workshop.description, { width: PAGE_LIMITS.indentWidth }) + 5;
        }
        
        if (workshop.awards) {
            doc.font(FONTS.italic).text(`Awards: ${workshop.awards}`, MARGINS.indent, y);
            y += 12;
        }
        
        y += SIZES.lineHeight;
    });
    
    return y + 10;
}

export async function generateCVPDF(cvData) {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ 
                size: 'A4', 
                margins: { top: MARGINS.top, bottom: MARGINS.bottom, left: MARGINS.left, right: MARGINS.right },
                bufferPages: true
            });
            
            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            
            let currentY = addHeader(doc, cvData);
            
            if (cvData.basicDetails?.photo) {
                await addPhotoToHeader(doc, cvData.basicDetails.photo);
            }
            
            currentY = addBasicInfo(doc, cvData, currentY);
            currentY = addEducation(doc, cvData, currentY);
            currentY = addUSMLEScores(doc, cvData, currentY);
            currentY = addExperienceSection(doc, cvData.clinicalExperiences, 'CLINICAL EXPERIENCE', currentY);
            currentY = addExperienceSection(doc, cvData.professionalExperiences, 'PROFESSIONAL EXPERIENCE', currentY);
            currentY = addExperienceSection(doc, cvData.volunteerExperiences, 'VOLUNTEER EXPERIENCE', currentY);
            currentY = addPublications(doc, cvData, currentY);
            currentY = addConferences(doc, cvData, currentY);
            currentY = addAchievements(doc, cvData, currentY);
            currentY = addSkills(doc, cvData, currentY);
            currentY = addEMRTraining(doc, cvData, currentY);
            currentY = addWorkshops(doc, cvData, currentY);
            
            const pageCount = doc.bufferedPageRange().count;
            for (let i = 0; i < pageCount; i++) {
                doc.switchToPage(i);
                doc.fontSize(SIZES.footer).fillColor(COLORS.darkGray).text(
                    `Page ${i + 1} of ${pageCount}`,
                    MARGINS.left,
                    doc.page.height - 30,
                    { align: 'center', width: doc.page.width - 100 }
                );
            }
            
            doc.end();
            
        } catch (error) {
            reject(error);
        }
    });
}