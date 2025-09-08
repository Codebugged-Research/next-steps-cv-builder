import {Router} from 'express';
import {createOrUpdateCV,getCV} from '../controllers/cv.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();

router.route('/save').post(verifyJWT, createOrUpdateCV);
router.route('/:userId').get(verifyJWT, getCV);

export default router;