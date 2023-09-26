import express from 'express';
import { StudentEnrolledCourseMarkController } from './studentEnrolledCourseMark.controller';
const router = express.Router();
router.patch("/update-mark", StudentEnrolledCourseMarkController.updateStudentMarks);
export const StudentEnrolledCourseMarkRoutes = router;