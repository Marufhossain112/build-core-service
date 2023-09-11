import { Request, Response } from 'express';
import { AcademicSemesterService } from './academicSemester.service';
import sendResponse from '../../../shared/sendResponse';
import { AcademicSemester } from '@prisma/client';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicSemesterService.insertIntoDb(req.body);
  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester created successfully.',
    data: result,
  });
});
export const AcademicSemesterController = {
  insertIntoDb,
};
