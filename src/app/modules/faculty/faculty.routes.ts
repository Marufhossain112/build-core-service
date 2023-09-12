import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyValidation } from './faculty.validation';
import { FacultyController } from './faculty.controller';

const router = express.Router();
router.post(
  '/',
  validateRequest(FacultyValidation.create),
  FacultyController.insertIntoDb
);
router.get('/:id', FacultyController.getDataById);
router.get('/', FacultyController.getAllFromDb);
export const FacultyRoutes = router;
