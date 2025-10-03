import { Router } from 'express';
import { uploadFile,deleteFile} from '../controllers/file.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { uploadPhoto } from '../middlewares/s3.upload.middleware.js';

const router = Router();

router.route('/upload').post(
    verifyJWT,
    uploadPhoto.single('photo'),
    uploadFile
);

router.delete(
  '/delete/:fileKey',
  verifyJWT,
  deleteFile
);

export default router;
