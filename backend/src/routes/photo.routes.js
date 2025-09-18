import { Router } from 'express';
import { uploadProfilePhoto, deleteProfilePhoto } from '../controllers/photo.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { uploadPhoto } from '../middlewares/s3Upload.middleware.js';

const router = Router();

router.route('/upload').post(
    verifyJWT,
    uploadPhoto.single('photo'),
    uploadProfilePhoto
);

router.route('/delete/:photoKey').delete(verifyJWT, deleteProfilePhoto);

export default router;