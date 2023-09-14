import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BuildingService } from './building.service';
import { Request, Response } from 'express';
import pick from '../../../shared/pick';
import {
  BuildingFilterableFields,
  BuildingPaginationOptions,
} from './building.constants';
const insertToDb = catchAsync(async (req: Request, res: Response) => {
  const result = await BuildingService.insertToDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building data created successfully',
    data: result,
  });
});
const getAllBuildings = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, BuildingFilterableFields);
  const options = pick(req.query, BuildingPaginationOptions);
  const result = await BuildingService.getAllBuildings(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get all buildings.',
    data: result,
  });
});
export const BuildingController = {
  insertToDb,
  getAllBuildings,
};
