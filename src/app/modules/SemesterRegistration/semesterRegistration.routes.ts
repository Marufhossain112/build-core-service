import express from 'express';
import { semesterRegistrationController } from './semesterRegistration.controller';
const router = express.Router();
router.post('/', semesterRegistrationController.insertIntoDb);
export const SemesterRegistrationRouter = router;
