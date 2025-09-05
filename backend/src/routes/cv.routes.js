import {Router} from 'express';
import {createOrUpdateCV,getCV} from '../controllers/cv.controller.js';
const router = Router();

router.route('/save').post(createOrUpdateCV);
router.route('/:userId').get(getCV);

export default router;