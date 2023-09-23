import express from 'express';
import { OfferedCourseClassScheduleController } from './offeredCourseClassSchedule.controller';
const router = express.Router();
router.post('/', OfferedCourseClassScheduleController.insertIntoDB);
router.get('/', OfferedCourseClassScheduleController.getAllFromDb);
export const OfferedCourseClassScheduleRoutes = router;
