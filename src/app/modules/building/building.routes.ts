import express from 'express';
import { BuildingController } from './building.controller';
import validateRequest from '../../middlewares/validateRequest';
import { BuildingValidation } from './building.validation';
const router = express.Router();
router.post(
  '/create-building',
  validateRequest(BuildingValidation.buildingValidation),
  BuildingController.insertToDb
);
router.get('/', BuildingController.getAllBuildings);
export const BuildingRoutes = router;
