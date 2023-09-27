import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyValidation } from './faculty.validation';
import { FacultyController } from './faculty.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();
router.post(
  '/',
  validateRequest(FacultyValidation.create),
  FacultyController.insertIntoDb
);
router.post(
  '/login',
  validateRequest(FacultyValidation.login),
  FacultyController.login
);
router.get('/my-courses', auth(ENUM_USER_ROLE.FACULTY), FacultyController.myCourses);
router.get('/:id', FacultyController.getDataById);
router.post(
  '/:id/assign-courses',
  validateRequest(FacultyValidation.assignOrRemoveCoursesValidation),
  FacultyController.assignCourses
);
router.delete(
  '/:id/remove-courses',
  validateRequest(FacultyValidation.assignOrRemoveCoursesValidation),
  FacultyController.removeCourses
);
router.get('/', FacultyController.getAllFromDb);
export const FacultyRoutes = router;
