import { Router } from 'express';
import {
    createConference,
    getAllConferences,
    getConferenceById,
    updateConference,
    deleteConference,
    getUpcomingConferences,
    registerForConference,
    getUserRegistrations,
    cancelRegistration,
    getPendingRegistrations,
    updateRegistrationStatus,
    uploadCertificate
} from '../controllers/conference.controller.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import { checkConferenceLimit } from '../middlewares/registrationLimits.middleware.js';
import { uploadCertificate as uploadCertificateMiddleware } from '../middlewares/s3.upload.middleware.js';

const router = Router();

router.route('/').get(getAllConferences);
router.route('/upcoming').get(getUpcomingConferences);
router.route('/registrations').get(verifyJWT, getUserRegistrations);
router.route('/pending-registrations').get(verifyJWT, verifyAdmin, getPendingRegistrations);
router.route('/create').post(verifyJWT, verifyAdmin, createConference);
router.route('/:id').get(getConferenceById);
router.route('/:id').put(verifyJWT, verifyAdmin, updateConference);
router.route('/:id').delete(verifyJWT, verifyAdmin, deleteConference);
router.route('/:id/register').post(verifyJWT, checkConferenceLimit, registerForConference);
router.route('/registrations/:registrationId').delete(verifyJWT, cancelRegistration);
router.route('/registrations/:registrationId').patch(verifyJWT, verifyAdmin, updateRegistrationStatus);
router.route('/registrations/:registrationId/certificate').post(verifyJWT, verifyAdmin, uploadCertificateMiddleware.single('certificate'), uploadCertificate);

export default router;