import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import { semesterRegistrationService } from './semesterRegistration.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await semesterRegistrationService.insertIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester registration created successfully.',
    data: result,
  });
});
export const semesterRegistrationController = {
  insertIntoDb,
};
