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
const updateToDb = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await semesterRegistrationService.updateToDb(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester registration updated successfully.',
    data: result,
  });
});
const deleteFromDb = catchAsync(async (req: Request, res: Response) => {
  const result = await semesterRegistrationService.deleteFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester registration data deleted successfully.',
    data: result,
  });
});
const startMyRegistration = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await semesterRegistrationService.startMyRegistration(
    user?.userId
  );
  console.log(result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester registration started successfully.',
    data: result,
  });
});
const enrollToCourse = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  // console.log('Usssssssssser', user);
  const result = await semesterRegistrationService.enrollToCourse(user?.userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrolled to course successfully.',
    data: result,
  });
});
export const semesterRegistrationController = {
  insertIntoDb,
  updateToDb,
  deleteFromDb,
  startMyRegistration,
  enrollToCourse
};
