import express from 'express';
import { BuildingController } from './building.controller';
const router = express.Router();
router.post(
  '/create-building',
  // validateRequest(BuildingValidation.buildingZodSchema),
  BuildingController.insertToDb
);
export const BuildingRoutes = router;
