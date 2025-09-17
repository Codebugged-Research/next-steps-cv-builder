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

        // Generate PDF content
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
       .text(`${cvData.basicDetails.email} | ${cvData.basicDetails.phone}`, { align: 'center' })
       .text(`${cvData.basicDetails.city}`, { align: 'center' })
       .moveDown(2);

    // Education Section
    addSection(doc, 'Education', primaryColor);
    doc.fontSize(12)
       .text(`${cvData.education.medicalSchoolName}`, { continued: false })
       .fontSize(10)
       .fillColor('gray')
       .text(`${cvData.education.country} | ${cvData.education.joiningDate} - ${cvData.education.completionDate}`)
       .fillColor('black')
       .moveDown();

    // USMLE Scores
    if (cvData.usmleScores.step1Status !== 'not-taken' || cvData.usmleScores.step2ckScore) {
        addSection(doc, 'USMLE Scores', primaryColor);
        if (cvData.usmleScores.step1Status !== 'not-taken') {
            doc.text(`USMLE Step 1: ${cvData.usmleScores.step1Status.toUpperCase()}`);
        }
        if (cvData.usmleScores.step2ckScore) {
            doc.text(`USMLE Step 2 CK: ${cvData.usmleScores.step2ckScore}`);
        }
        if (cvData.usmleScores.ecfmgCertified) {
            doc.text(`ECFMG Certified: Yes`);
        }
        doc.moveDown();
    }

    // Skills
    if (cvData.skills) {
        addSection(doc, 'Skills', primaryColor);
        doc.text(cvData.skills);
        doc.moveDown();
    }

    // Clinical Experiences
    if (cvData.clinicalExperiences.length > 0) {
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

    // Publications
    if (cvData.publications.length > 0) {
        addSection(doc, 'Publications', primaryColor);
        cvData.publications.forEach((pub, index) => {
            doc.fontSize(10)
               .text(`${index + 1}. ${pub.title}`)
               .fillColor('gray')
               .text(`${pub.journal}, ${pub.year}`)
               .fillColor('black')
               .moveDown(0.5);
        });
        doc.moveDown();
    }

    // Conferences
    if (cvData.conferences.length > 0) {
        addSection(doc, 'Conferences', primaryColor);
        cvData.conferences.forEach(conf => {
            doc.fontSize(10)
               .text(`${conf.name} (${conf.year})`)
               .fillColor('gray')
               .text(`Role: ${conf.role}`)
               .fillColor('black');
            if (conf.description) {
                doc.text(conf.description);
            }
            doc.moveDown(0.5);
        });
        doc.moveDown();
    }

    // Workshops
    if (cvData.workshops.length > 0) {
        addSection(doc, 'Workshops', primaryColor);
        cvData.workshops.forEach(workshop => {
            doc.fontSize(10)
               .text(`${workshop.name}`)
               .fillColor('gray')
               .text(`${workshop.organizer} | ${workshop.year}`)
               .fillColor('black');
            if (workshop.description) {
                doc.text(workshop.description);
            }
            doc.moveDown(0.5);
        });
        doc.moveDown();
    }

    // Achievements
    if (cvData.significantAchievements) {
        addSection(doc, 'Achievements', primaryColor);
        doc.text(cvData.significantAchievements);
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