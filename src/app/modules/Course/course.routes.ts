import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseController } from './course.controller';
import { CourseValidation } from './course.validation';
const router = express.Router();
router.post(
  '/',
  validateRequest(CourseValidation.courseCreateValidation),
  CourseController.insertIntoDb
);
router.patch(
  '/:id',
  validateRequest(CourseValidation.courseUpdateValidation),
  CourseController.updateOneInDb
);
router.post(
  '/:id/assign-faculties',
  validateRequest(CourseValidation.assignOrRemoveFacultiesValidation),
  CourseController.assignFaculties
);
router.delete(
  '/:id/remove-faculties',
  validateRequest(CourseValidation.assignOrRemoveFacultiesValidation),
  CourseController.removeFaculties
);
router.get('/', CourseController.getAllCourses);
export const CourseRoutes = router;
