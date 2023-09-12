import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { AcademicFaculty } from '@prisma/client';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import { AcademicFacultyService } from './academicFaculty.service';
import { AcademicFacultyFilterableFields } from './academicFaculty.constrants';
import { AcademicFacultyPaginationFields } from '../academicFaculty/academicFaculty.constrants';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicFacultyService.insertIntoDb(req.body);
  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty created successfully.',
    data: result,
  });
});
const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.query);
  const filters = pick(req.query, AcademicFacultyFilterableFields);
  const options = pick(req.query, AcademicFacultyPaginationFields);

  const result = await AcademicFacultyService.getAllFromDb(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic faculty data fetched  successfully.',
    meta: result.meta,
    data: result.data,
  });
});
const getDataById = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicFacultyService.getDataById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic single data fetched  successfully.',
    data: result,
  });
});
export const AcademicFacultyController = {
  insertIntoDb,
  getAllFromDb,
  getDataById,
};
