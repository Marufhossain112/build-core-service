import { Student } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { AcademicFacultyPaginationFields } from '../academicFaculty/academicFaculty.constrants';
import { StudentService } from './student.service';
import { StudentFilterableFields } from './student.constrants';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.insertIntoDb(req.body);
  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student created successfully.',
    data: result,
  });
});
const login = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.login(req.body);
  // console.log('controller', result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User signin successfully!',
    data: result
  });
});
const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.query);
  const filters = pick(req.query, StudentFilterableFields);
  const options = pick(req.query, AcademicFacultyPaginationFields);

  const result = await StudentService.getAllFromDb(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student data fetched  successfully.',
    meta: result.meta,
    data: result.data,
  });
});
const getDataById = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.getDataById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student single data fetched  successfully.',
    data: result,
  });
});
const updateToDb = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.updateToDb(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student data updated successfully.',
    data: result,
  });
});
const deleteFromDb = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.deleteFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student data deleted successfully.',
    data: result,
  });
});
export const StudentController = {
  insertIntoDb,
  getAllFromDb,
  getDataById,
  updateToDb,
  deleteFromDb,
  login
};
