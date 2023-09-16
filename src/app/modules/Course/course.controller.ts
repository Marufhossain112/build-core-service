import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import { CourseService } from './course.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { CourseFilterableFields } from './course.constants';
import { paginationFields } from '../../../constants/pagination';
const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const { ...courseData } = req.body;
  const result = await CourseService.insertIntoDb(courseData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course created successfully.',
    data: result,
  });
  //   console.log(req.body);

  //   return result;
});
const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, CourseFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await CourseService.getAllCourses(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All courses fetched successfully.',
    data: result,
  });
});
const updateOneInDb = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.updateOneInDb(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'One course updated successfully.',
    data: result,
  });
});
const assignFaculties = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.assignFaculties(id, req.body.faculties);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assigned faculties successfully.',
    data: result,
  });
});
const removeFaculties = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.removeFaculties(id, req.body.faculties);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Removed faculties successfully.',
    data: result,
  });
});
export const CourseController = {
  insertIntoDb,
  getAllCourses,
  updateOneInDb,
  assignFaculties,
  removeFaculties,
};
