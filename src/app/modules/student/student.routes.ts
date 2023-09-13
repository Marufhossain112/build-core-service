import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidation } from './student.validation';
import { StudentController } from './student.controller';

const router = express.Router();
router.post(
  '/',
  validateRequest(StudentValidation.create),
  StudentController.insertIntoDb
);
router.get('/:id', StudentController.getDataById);
router.get('/', StudentController.getAllFromDb);
router.patch(
  '/:id',
  validateRequest(StudentValidation.update),
  StudentController.updateToDb
);
export const StudentRoutes = router;
