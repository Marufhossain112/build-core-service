import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyController } from './academicFaculty.controller';
const router = express.Router();
router.post(
  '/',
  validateRequest(AcademicFacultyValidation.create),
  AcademicFacultyController.insertIntoDb
);
router.get('/:id', AcademicFacultyController.getDataById);
router.get('/', AcademicFacultyController.getAllFromDb);
export const AcademicFacultyRoutes = router;
