import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
import { AcademicDepartmentController } from './academicDepartment.controller';

const router = express.Router();
router.post(
  '/',
  validateRequest(AcademicDepartmentValidation.create),
  AcademicDepartmentController.insertIntoDb
);
router.get('/:id', AcademicDepartmentController.getDataById);
router.get('/', AcademicDepartmentController.getAllFromDb);
export const AcademicDepartmentRoutes = router;
