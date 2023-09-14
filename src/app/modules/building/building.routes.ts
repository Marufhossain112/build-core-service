import express from 'express';
import { BuildingController } from './building.controller';
const router = express.Router();
router.post('/create-building', BuildingController.insertToDb);
router.get('/', BuildingController.getAllBuildings);
export const BuildingRoutes = router;
