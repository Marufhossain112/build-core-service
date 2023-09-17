import express from 'express';
import { OfferedCourseServiceController } from './offeredCourseSection.controller';
const router = express.Router();
router.post('/', OfferedCourseServiceController.insertIntoDB);
export const OfferedCourseSectionRoutes = router;
