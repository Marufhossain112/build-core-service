import express from 'express';
import { OfferedCourseController } from './offeredCourse.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseValidation } from './offeredCourse.validation';
const router = express.Router();
router.post(
  '/',
  validateRequest(OfferedCourseValidation.create),
  OfferedCourseController.insertIntoDb
);
export const OfferedCourseRoutes = router;
