import { Request, Response, NextFunction } from 'express';
import { AcademicSemesterService } from './academicSemester.service';
import sendResponse from '../../../shared/sendResponse';
import { AcademicSemester } from '@prisma/client';
import httpStatus from 'http-status';

const insertIntoDb = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AcademicSemesterService.insertIntoDb(req.body);
    sendResponse<AcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester created successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const AcademicSemesterController = {
  insertIntoDb,
};
