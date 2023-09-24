import express from 'express';
import { semesterRegistrationController } from './semesterRegistration.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();
router.post(
  '/',
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationValidation
  ),
  semesterRegistrationController.insertIntoDb
);
router.post(
  '/start-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  semesterRegistrationController.startMyRegistration
);
router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidation.updateSemesterRegistrationValidation
  ),
  semesterRegistrationController.updateToDb
);
router.post(
  '/enroll-to-course', validateRequest(
    SemesterRegistrationValidation.enrollOrWithdrawCourse
  ), auth(ENUM_USER_ROLE.STUDENT), semesterRegistrationController.enrollToCourse
);
router.post(
  '/withdraw-from-course', validateRequest(
    SemesterRegistrationValidation.enrollOrWithdrawCourse
  ), auth(ENUM_USER_ROLE.STUDENT), semesterRegistrationController.withdrawFromCourse
);
router.post(
  '/confirm-my-registration', auth(ENUM_USER_ROLE.STUDENT), semesterRegistrationController.confirmMyRegistration
);
router.get(
  '/get-my-registration', auth(ENUM_USER_ROLE.STUDENT), semesterRegistrationController.getMyRegistration
);
router.delete('/:id', semesterRegistrationController.deleteFromDb);
export const SemesterRegistrationRouter = router;
