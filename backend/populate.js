import mongoose from 'mongoose';
import { Workshop } from './src/models/workshop.model.js';

const MONGODB_URI = 'mongodb+srv://admin_user:thisisadmin@csvbuilder.endxvrm.mongodb.net/?retryWrites=true&w=majority&appName=CSVBuilder';

const workshopsData = [
  {
    title: 'Basic Life Support (BLS) Certification',
    description: 'Comprehensive BLS training covering CPR techniques, AED usage, and relief of choking for adults, children, and infants. Includes hands-on practice and certification exam.',
    type: 'BLS',
    date: new Date('2025-12-05'),
    startTime: '09:00 AM',
    endTime: '01:00 PM',
    location: 'Medical Training Center, Room 301',
    capacity: 25,
    instructor: 'Dr. Sarah Mitchell',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'Advanced Cardiovascular Life Support (ACLS) Initial Course',
    description: 'Intensive ACLS training focusing on cardiac arrest management, acute coronary syndromes, and stroke protocols. Requires current BLS certification.',
    type: 'ACLS',
    date: new Date('2025-12-08'),
    startTime: '08:00 AM',
    endTime: '05:00 PM',
    location: 'Simulation Lab, Building B',
    capacity: 20,
    instructor: 'Dr. Michael Chen',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'BLS Provider Course - Weekend Session',
    description: 'Weekend BLS certification course for healthcare providers. Learn high-quality CPR for adults, children, and infants, and become familiar with AED operation.',
    type: 'BLS',
    date: new Date('2025-12-14'),
    startTime: '10:00 AM',
    endTime: '03:00 PM',
    location: 'Training Room A, Main Campus',
    capacity: 30,
    instructor: 'Dr. Emily Rodriguez',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'ACLS Renewal Course',
    description: 'ACLS recertification for healthcare professionals. Review and practice ACLS algorithms, pharmacology, and effective resuscitation team dynamics.',
    type: 'ACLS',
    date: new Date('2025-12-18'),
    startTime: '09:00 AM',
    endTime: '04:00 PM',
    location: 'Medical Training Center, Room 205',
    capacity: 18,
    instructor: 'Dr. James Anderson',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'BLS for Healthcare Providers - Accelerated',
    description: 'Fast-paced BLS certification covering all essential life-saving techniques. Includes written exam and skills demonstration.',
    type: 'BLS',
    date: new Date('2025-12-21'),
    startTime: '01:00 PM',
    endTime: '05:00 PM',
    location: 'Emergency Training Wing, Floor 2',
    capacity: 22,
    instructor: 'Dr. Lisa Thompson',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'ACLS Megacode Workshop',
    description: 'Advanced practice session focusing on ACLS megacode scenarios. Perfect for those preparing for ACLS certification or recertification.',
    type: 'ACLS',
    date: new Date('2025-12-27'),
    startTime: '10:00 AM',
    endTime: '02:00 PM',
    location: 'Simulation Lab, Building B',
    capacity: 15,
    instructor: 'Dr. Robert Kim',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'BLS Instructor Development Course',
    description: 'Train to become a BLS instructor. Learn teaching methodologies, course coordination, and student evaluation techniques.',
    type: 'BLS',
    date: new Date('2026-03-10'),
    startTime: '08:00 AM',
    endTime: '06:00 PM',
    location: 'Professional Development Center',
    capacity: 12,
    instructor: 'Dr. Amanda Foster',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'ACLS Provider Course - Spring Session',
    description: 'Complete ACLS provider training with emphasis on recognition and intervention of cardiopulmonary arrest, acute arrhythmia, and stroke.',
    type: 'ACLS',
    date: new Date('2026-03-15'),
    startTime: '08:00 AM',
    endTime: '05:00 PM',
    location: 'Medical Training Center, Room 301',
    capacity: 20,
    instructor: 'Dr. Sarah Mitchell',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'BLS Skills Refresher Workshop',
    description: 'Hands-on skills practice session for BLS certified providers. Maintain proficiency in CPR techniques and AED usage.',
    type: 'BLS',
    date: new Date('2026-03-22'),
    startTime: '02:00 PM',
    endTime: '05:00 PM',
    location: 'Skills Lab, Building A',
    capacity: 25,
    instructor: 'Dr. Michael Chen',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'ACLS Update Course - New Guidelines',
    description: 'Learn the latest ACLS guidelines and protocols. Required for all ACLS providers to stay current with best practices.',
    type: 'ACLS',
    date: new Date('2026-03-28'),
    startTime: '09:00 AM',
    endTime: '01:00 PM',
    location: 'Conference Room C',
    capacity: 30,
    instructor: 'Dr. Emily Rodriguez',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'BLS Pediatric Focus Session',
    description: 'Specialized BLS training with emphasis on pediatric resuscitation techniques, infant CPR, and choking relief in children.',
    type: 'BLS',
    date: new Date('2026-06-05'),
    startTime: '09:00 AM',
    endTime: '02:00 PM',
    location: 'Pediatric Training Center',
    capacity: 20,
    instructor: 'Dr. Jennifer Martinez',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'ACLS Full Certification - Summer Intensive',
    description: 'Two-day intensive ACLS certification course covering all core competencies. Includes written and practical examinations.',
    type: 'ACLS',
    date: new Date('2026-06-12'),
    startTime: '08:00 AM',
    endTime: '05:00 PM',
    location: 'Medical Training Center, Room 205',
    capacity: 18,
    instructor: 'Dr. James Anderson',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'BLS Provider Course - Evening Session',
    description: 'Evening BLS certification designed for working professionals. Complete all requirements in one convenient session.',
    type: 'BLS',
    date: new Date('2026-06-18'),
    startTime: '05:00 PM',
    endTime: '09:00 PM',
    location: 'Training Room B, South Campus',
    capacity: 28,
    instructor: 'Dr. Lisa Thompson',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'ACLS Team Dynamics Workshop',
    description: 'Focus on effective communication, role clarity, and leadership during cardiac emergencies. Enhance your ACLS team performance.',
    type: 'ACLS',
    date: new Date('2026-06-25'),
    startTime: '10:00 AM',
    endTime: '03:00 PM',
    location: 'Simulation Lab, Building B',
    capacity: 16,
    instructor: 'Dr. Robert Kim',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'BLS Certification - Fast Track',
    description: 'Condensed BLS certification course for experienced healthcare providers. Efficient review and skills validation.',
    type: 'BLS',
    date: new Date('2026-09-08'),
    startTime: '01:00 PM',
    endTime: '05:00 PM',
    location: 'Emergency Training Wing, Floor 2',
    capacity: 24,
    instructor: 'Dr. Amanda Foster',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'ACLS Pharmacology Deep Dive',
    description: 'In-depth review of ACLS medications, dosing, indications, and contraindications. Perfect for exam preparation.',
    type: 'ACLS',
    date: new Date('2026-09-14'),
    startTime: '09:00 AM',
    endTime: '12:00 PM',
    location: 'Conference Room A',
    capacity: 25,
    instructor: 'Dr. Sarah Mitchell',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'BLS for Medical Students',
    description: 'Introductory BLS course tailored for medical students. Foundation training in life-saving techniques and emergency response.',
    type: 'BLS',
    date: new Date('2026-09-20'),
    startTime: '10:00 AM',
    endTime: '03:00 PM',
    location: 'Medical Training Center, Room 301',
    capacity: 35,
    instructor: 'Dr. Michael Chen',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'ACLS Recertification - Fall Session',
    description: 'ACLS renewal course with updated protocols. Maintain your certification with comprehensive review and testing.',
    type: 'ACLS',
    date: new Date('2026-09-26'),
    startTime: '08:00 AM',
    endTime: '04:00 PM',
    location: 'Training Room A, Main Campus',
    capacity: 20,
    instructor: 'Dr. Emily Rodriguez',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'BLS Advanced Skills Workshop',
    description: 'Beyond basic certification. Learn advanced airway management, team coordination, and high-performance CPR techniques.',
    type: 'BLS',
    date: new Date('2026-12-03'),
    startTime: '09:00 AM',
    endTime: '02:00 PM',
    location: 'Skills Lab, Building A',
    capacity: 18,
    instructor: 'Dr. James Anderson',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'ACLS Cardiac Arrest Management',
    description: 'Focused training on cardiac arrest scenarios, systematic approach to resuscitation, and post-cardiac arrest care.',
    type: 'ACLS',
    date: new Date('2026-12-10'),
    startTime: '08:00 AM',
    endTime: '05:00 PM',
    location: 'Simulation Lab, Building B',
    capacity: 16,
    instructor: 'Dr. Lisa Thompson',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'BLS Comprehensive Review',
    description: 'Complete review of BLS protocols, guidelines, and practical skills. Ideal for recertification preparation.',
    type: 'BLS',
    date: new Date('2026-12-15'),
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    location: 'Medical Training Center, Room 205',
    capacity: 30,
    instructor: 'Dr. Robert Kim',
    registeredUsers: [],
    status: 'scheduled'
  },
  {
    title: 'ACLS Provider Course - Year End',
    description: 'Final ACLS certification course of the year. Comprehensive training with experienced instructors and state-of-the-art equipment.',
    type: 'ACLS',
    date: new Date('2026-12-20'),
    startTime: '08:00 AM',
    endTime: '05:00 PM',
    location: 'Emergency Training Wing, Floor 2',
    capacity: 22,
    instructor: 'Dr. Amanda Foster',
    registeredUsers: [],
    status: 'scheduled'
  }
];

const populateWorkshops = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Workshop.deleteMany({});
    console.log('Cleared existing workshops');

    const workshops = await Workshop.insertMany(workshopsData);
    console.log(`Successfully inserted ${workshops.length} workshops`);

    console.log('\nWorkshops by month:');
    console.log('December 2025:', workshops.filter(w => w.date.getMonth() === 11 && w.date.getFullYear() === 2025).length);
    console.log('March 2026:', workshops.filter(w => w.date.getMonth() === 2 && w.date.getFullYear() === 2026).length);
    console.log('June 2026:', workshops.filter(w => w.date.getMonth() === 5 && w.date.getFullYear() === 2026).length);
    console.log('September 2026:', workshops.filter(w => w.date.getMonth() === 8 && w.date.getFullYear() === 2026).length);
    console.log('December 2026:', workshops.filter(w => w.date.getMonth() === 11 && w.date.getFullYear() === 2026).length);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error populating workshops:', error);
    process.exit(1);
  }
};

populateWorkshops();