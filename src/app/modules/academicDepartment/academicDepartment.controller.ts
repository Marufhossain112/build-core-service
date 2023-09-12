import { AcademicFaculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { AcademicFacultyPaginationFields } from '../academicFaculty/academicFaculty.constrants';
import { AcademicDepartmentService } from './academicDepartment.service';
import {
  AcademicDepartmentFilterableFields,
  AcademicDepartmentSearchableFields,
} from './academicDepartment.constrants';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicDepartmentService.insertIntoDb(req.body);
  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty created successfully.',
    data: result,
  });
});
const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.query);
  const filters = pick(req.query, AcademicDepartmentFilterableFields);
  const options = pick(req.query, AcademicFacultyPaginationFields);

  const result = await AcademicDepartmentService.getAllFromDb(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic department data fetched  successfully.',
    meta: result.meta,
    data: result.data,
  });
});
const getDataById = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicDepartmentService.getDataById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic single data fetched  successfully.',
    data: result,
  });
});
export const AcademicDepartmentController = {
  insertIntoDb,
  getAllFromDb,
  getDataById,
};
