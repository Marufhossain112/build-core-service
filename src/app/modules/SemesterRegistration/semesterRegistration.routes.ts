import express from 'express';
import { semesterRegistrationController } from './semesterRegistration.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';
const router = express.Router();
router.post(
  '/',
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationValidation
  ),
  semesterRegistrationController.insertIntoDb
);
router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidation.updateSemesterRegistrationValidation
  ),
  semesterRegistrationController.updateToDb
);
router.delete('/:id', semesterRegistrationController.deleteFromDb);
export const SemesterRegistrationRouter = router;
