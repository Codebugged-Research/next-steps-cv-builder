import { Router } from 'express';
import {
  createWorkshop,
  getAllWorkshops,
  getWorkshopById,
  updateWorkshop,
  deleteWorkshop,
  getUpcomingWorkshops,
  registerForWorkshop,
  getUserRegistrations,
  cancelRegistration,
  confirmRegistration,
  rejectRegistration,
  getPendingRegistrations,
  uploadCertificate,
  deleteCertificate
} from '../controllers/workshop.controller.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import { uploadCertificate as uploadCertificateMiddleware } from '../middlewares/s3.upload.middleware.js';
import { checkWorkshopLimit } from '../middlewares/registrationLimits.middleware.js';


const router = Router();

router.route('/').get(getAllWorkshops);
router.route('/upcoming').get(getUpcomingWorkshops);
router.route('/registrations').get(verifyJWT, getUserRegistrations);
router.route('/pending-registrations').get(verifyJWT, verifyAdmin, getPendingRegistrations);
router.route('/create').post(verifyJWT, verifyAdmin, createWorkshop);
router.route('/:id').get(getWorkshopById);
router.route('/:id').put(verifyJWT, verifyAdmin, updateWorkshop);
router.route('/:id').delete(verifyJWT, verifyAdmin, deleteWorkshop);
router.route('/:id/register').post(verifyJWT, checkWorkshopLimit, registerForWorkshop);
router.route('/registrations/:registrationId').delete(verifyJWT, cancelRegistration);
router.route('/registrations/:registrationId/confirm').put(verifyJWT, verifyAdmin, confirmRegistration);
router.route('/registrations/:registrationId/reject').put(verifyJWT, verifyAdmin, rejectRegistration);
router.route('/registrations/:registrationId/certificate').post(verifyJWT, verifyAdmin, uploadCertificateMiddleware.single('certificate'), uploadCertificate);
router.route('/registrations/:registrationId/certificate').delete(verifyJWT, verifyAdmin, deleteCertificate);

export default router;