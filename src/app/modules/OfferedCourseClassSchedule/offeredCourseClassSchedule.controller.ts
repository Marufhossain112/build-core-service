import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { OfferedCourseClassScheduleService } from './offeredCourseClassSchedule.service';
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
export const OfferedCourseClassScheduleController = {
  insertIntoDB,
};
