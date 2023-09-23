import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { OfferedCourseClassScheduleService } from './offeredCourseClassSchedule.service';
import { OfferedCourseClassScheduleFilterRequest } from './offeredCourseClassSchedule.constants';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.body);
  const result = await OfferedCourseClassScheduleService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course schedule created successfully.',
    data: result,
  });
});
const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.body);
  const filters = pick(req.query, OfferedCourseClassScheduleFilterRequest);
  const options = pick(req.query, paginationFields);
  const result = await OfferedCourseClassScheduleService.getAllFromDb(
    filters,
    options
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All offered course schedule fetched successfully.',
    data: result,
  });
});
export const OfferedCourseClassScheduleController = {
  insertIntoDB,
  getAllFromDb,
};
