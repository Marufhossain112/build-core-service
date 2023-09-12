import express from 'express';
import { AcademicSemesterController } from './academicSemester.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterValidation } from './academicSemester.validation';
const router = express.Router();
router.post(
  '/',
  validateRequest(AcademicSemesterValidation.create),
  AcademicSemesterController.insertIntoDb
);
router.get('/:id', AcademicSemesterController.getDataById);
router.get('/', AcademicSemesterController.getAllFromDb);
export const AcademicSemesterRoutes = router;
