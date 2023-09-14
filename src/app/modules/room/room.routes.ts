import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { RoomValidation } from './room.validation';
import { RoomController } from './room.controller';
const router = express.Router();
router.post(
  '/create-room',
  validateRequest(RoomValidation.roomZodValidation),
  RoomController.insertToDb
);
export const RoomRoutes = router;
