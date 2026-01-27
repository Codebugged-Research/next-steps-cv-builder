import { Router } from 'express';
import {
  createPublication,
  getAllPublications,
  getPublicationById,
  getUserPublications,
  updatePublication,
  deletePublication,
  updateProjectStage,
  updateProjectName,
  getPublicationsByStage,
  uploadCertificate,
  uploadProjectFile,
  deleteCertificate,
  getPublicationStats
} from '../controllers/publication.controller.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import { uploadCertificate as uploadCertificateMiddleware, uploadDocument } from '../middlewares/s3.upload.middleware.js';

const router = Router();

router.route('/').get(verifyJWT, verifyAdmin, getAllPublications);
router.route('/stats').get(verifyJWT, verifyAdmin, getPublicationStats);
router.route('/stage/:stage').get(verifyJWT, verifyAdmin, getPublicationsByStage);
router.route('/user/publications').get(verifyJWT, getUserPublications);
router.route('/create').post(verifyJWT, createPublication);
router.route('/:id').get(getPublicationById);
router.route('/:id').put(verifyJWT, updatePublication);
router.route('/:id').delete(verifyJWT, deletePublication);

router.route('/:id/projects/:projectId/stage').put(verifyJWT, verifyAdmin, updateProjectStage);
router.route('/:id/projects/:projectId/name').put(verifyJWT, verifyAdmin, updateProjectName);
router.route('/:id/projects/:projectId/file').post(verifyJWT, verifyAdmin, uploadDocument.single('document'), uploadProjectFile);

router.route('/:id/certificate').post(verifyJWT, verifyAdmin, uploadCertificateMiddleware.single('certificate'), uploadCertificate);
router.route('/:id/certificate').delete(verifyJWT, verifyAdmin, deleteCertificate);

export default router;