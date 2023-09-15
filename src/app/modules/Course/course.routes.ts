import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseController } from './course.controller';
import { CourseValidation } from './course.validation';
const router = express.Router();
router.post(
  '/',
  validateRequest(CourseValidation.courseZodValidation),
  CourseController.insertIntoDb
);
router.get('/', CourseController.getAllCourses);
export const CourseRoutes = router;
