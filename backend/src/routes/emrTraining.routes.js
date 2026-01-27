import { Router } from 'express';
import {
  registerForTraining,
  getUserRegistrations,
  cancelRegistration,
  getAllRegistrations,
  confirmRegistration,
  rejectRegistration,
  markAsCompleted,
  getPendingRegistrations,
  getRegistrationStats,
  uploadCertificate,
  deleteCertificate
} from '../controllers/emrTraining.controller.js';

import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import { uploadCertificate as uploadCertificateMiddleware } from '../middlewares/s3.upload.middleware.js';
import { checkEmrTrainingLimit } from '../middlewares/registrationLimits.middleware.js';

const router = Router();

router.route('/').get(verifyJWT, verifyAdmin, getAllRegistrations);

router.route('/register').post(verifyJWT, checkEmrTrainingLimit, registerForTraining);

router.route('/my-registrations').get(verifyJWT, getUserRegistrations);

router.route('/pending-registrations').get(verifyJWT, verifyAdmin, getPendingRegistrations);

router.route('/stats').get(verifyJWT, verifyAdmin, getRegistrationStats);

router.route('/registrations/:registrationId').delete(verifyJWT, cancelRegistration);

router.route('/registrations/:registrationId/confirm').put(verifyJWT, verifyAdmin, confirmRegistration);

router.route('/registrations/:registrationId/reject').put(verifyJWT, verifyAdmin, rejectRegistration);

router.route('/registrations/:registrationId/complete').put(verifyJWT, verifyAdmin, markAsCompleted);

router.route('/registrations/:registrationId/certificate').post(verifyJWT, verifyAdmin, uploadCertificateMiddleware.single('certificate'), uploadCertificate);

router.route('/registrations/:registrationId/certificate').delete(verifyJWT, verifyAdmin, deleteCertificate);

export default router;