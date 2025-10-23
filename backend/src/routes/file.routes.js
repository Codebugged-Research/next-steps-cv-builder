import { Router } from 'express';
import { uploadFile,deleteFile} from '../controllers/file.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { uploadPhoto,uploadDocument } from '../middlewares/s3.upload.middleware.js';

const router = Router();

router.route('/upload').post(
    verifyJWT,
    uploadPhoto.single('document'),
    uploadFile
);
router.route('/documents/upload').post(
    verifyJWT,
    uploadDocument.single('document'),
    uploadFile
);
router.delete(
  '/delete/:fileKey',
  verifyJWT,
  deleteFile
);

export default router;
