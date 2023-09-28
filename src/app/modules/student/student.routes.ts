import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidation } from './student.validation';
import { StudentController } from './student.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();
router.post(
  '/signup',
  // auth(ENUM_USER_ROLE.STUDENT)
  validateRequest(StudentValidation.create),
  StudentController.insertIntoDb
);
router.post(
  '/signin',
  validateRequest(StudentValidation.login),
  StudentController.login
);

router.get('/my-courses',
  auth(ENUM_USER_ROLE.STUDENT)
  , StudentController.myCourses);
router.get('/:id', StudentController.getDataById);
router.get('/', StudentController.getAllFromDb);
router.patch(
  '/:id',
  validateRequest(StudentValidation.update),
  StudentController.updateToDb
);
router.delete('/:id', StudentController.deleteFromDb);
export const StudentRoutes = router;
