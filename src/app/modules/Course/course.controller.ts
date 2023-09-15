import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import { CourseService } from './course.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { CourseFilterableFields } from './course.constants';
import { paginationFields } from '../../../constants/pagination';
import { prisma } from '../../../shared/prisma';
const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const { prerequisiteCourses, ...courseData } = req.body;
  const result = await CourseService.insertIntoDb(courseData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course created successfully.',
    data: result,
  });
  //   console.log(req.body);
  //   console.log('prerequisiteCourses', prerequisiteCourses);
  //   console.log('courseData', courseData);
  //   if (prerequisiteCourses && prerequisiteCourses.length > 0) {
  //     prerequisiteCourses.map(async (course: any) => {
  //       console.log(course);
  //       const createPrerequisite = await prisma.courseToPrerequisite.create({
  //         courseId: result.id,
  //         prerequisiteId: course.courseId,
  //       });
  //     });
  //   }
  if (prerequisiteCourses && prerequisiteCourses.length > 0) {
    // await Promise.all(
    prerequisiteCourses.map(async (course: any) => {
      console.log(course);
      const createPrerequisite = await prisma.courseToPrerequisite.create({
        data: {
          courseId: result.id,
          prerequisiteId: course.courseId,
        },
      });
      console.log(createPrerequisite);
    });
  }
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
export const CourseController = {
  insertIntoDb,
  getAllCourses,
};
