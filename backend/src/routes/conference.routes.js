import { Router } from 'express';
import { 
    createConference, 
    getAllConferences, 
    getConferenceById, 
    updateConference, 
    deleteConference,
    getUpcomingConferences
} from '../controllers/conference.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/').get(getAllConferences);
router.route('/upcoming').get(getUpcomingConferences);
router.route('/create').post(verifyJWT, createConference);
router.route('/:id').get(getConferenceById);
router.route('/:id').put(verifyJWT, updateConference);
router.route('/:id').delete(verifyJWT, deleteConference);

export default router;