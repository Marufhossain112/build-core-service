import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyController } from './academicFaculty.controller';
// import auth from '../../middlewares/auth';
// import { ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();
router.post(
  '/',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(AcademicFacultyValidation.create),
  AcademicFacultyController.insertIntoDb
);
router.get('/:id', AcademicFacultyController.getDataById);
router.get('/', AcademicFacultyController.getAllFromDb);
export const AcademicFacultyRoutes = router;
