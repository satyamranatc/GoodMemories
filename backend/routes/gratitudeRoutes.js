import express from 'express';
import upload from '../config/cloudinary.js';
import { createPage, getPage, addFeedback } from '../controllers/gratitudeController.js';

const router = express.Router();

router.post('/', upload.array('photos', 5), createPage);
router.get('/:pageId', getPage);
router.post('/:pageId/feedback', addFeedback);

export default router;
