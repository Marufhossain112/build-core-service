import { Faculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import {
  FacultyFilterableFields,
  FacultyPaginationFields,
} from './faculty.constrants';
import { FacultyService } from './faculty.service';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.insertIntoDb(req.body);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty created successfully.',
    data: result,
  });
});
const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.query);
  const filters = pick(req.query, FacultyFilterableFields);
  const options = pick(req.query, FacultyPaginationFields);

  const result = await FacultyService.getAllFromDb(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty data fetched  successfully.',
    meta: result.meta,
    data: result.data,
  });
});
const getDataById = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.getDataById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty single data fetched  successfully.',
    data: result,
  });
});
export const FacultyController = {
  insertIntoDb,
  getAllFromDb,
  getDataById,
};
