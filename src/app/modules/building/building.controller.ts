import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BuildingService } from './building.service';
import { Request, Response } from 'express';
const insertToDb = catchAsync(async (req: Request, res: Response) => {
  const result = await BuildingService.insertToDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building data created successfully',
    data: result,
  });
});
export const BuildingController = {
  insertToDb,
};
