import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
const router = express.Router();
router.post(
  '/signup',
  validateRequest(AuthValidation.signUpValidation),
  AuthController.signUp
);
router.post(
  '/signin',
  validateRequest(AuthValidation.loginValidation),
  AuthController.login
);
export const AuthRoutes = router;
