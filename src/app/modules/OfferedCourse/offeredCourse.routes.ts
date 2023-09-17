import express from 'express';
import { OfferedCourseController } from './offeredCourse.controller';
const router = express.Router();
router.post('/', OfferedCourseController.insertIntoDb);
export const OfferedCourseRoutes = router;
