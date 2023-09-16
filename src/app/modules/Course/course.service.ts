import { Course, Prisma } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import {
  ICourseCreateData,
  ICourseFilterableFields,
  IPrerequisiteCourseRequest,
} from './course.interface';
import { IGenericResponse } from '../../../interfaces/common';
import { CourseSearchableFields } from './course.constants';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { asyncForEach } from '../../../shared/utils';

const insertIntoDb = async (data: any): Promise<any> => {
  const { prerequisiteCourses, ...courseData } = data;
  const newCourse = await prisma.$transaction(async transanctionClient => {
    const result = await transanctionClient.course.create({
      data: courseData,
    });
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Course not created.');
    }
    if (prerequisiteCourses && prerequisiteCourses.length > 0) {
      await asyncForEach(
        prerequisiteCourses,
        async (prerequisiteCourse: IPrerequisiteCourseRequest) => {
          const createPrerequisite =
            await transanctionClient.courseToPrerequisite.create({
              data: {
                courseId: result.id,
                prerequisiteId: prerequisiteCourse.courseId,
              },
            });
          console.log(createPrerequisite);
        }
      );
    }
    return result;
  });
  // return newCourse;
  if (newCourse) {
    const responseData = await prisma.course.findUnique({
      where: {
        id: newCourse.id,
      },
      include: {
        prerequisite: {
          include: {
            prerequisite: true,
          },
        },
        prerequisiteFor: {
          include: {
            prerequisite: true,
          },
        },
      },
    });
    return responseData;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Course not created.');
};
const updateOneInDb = async (
  id: string,
  payload: ICourseCreateData
) /* : Promise<Course | null> */ => {
  const { prerequisiteCourses, ...courseData } = payload;
  await prisma.$transaction(async transanctionClient => {
    const result = await transanctionClient.course.update({
      where: { id },
      data: courseData,
    });
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to update');
    }
    if (prerequisiteCourses && prerequisiteCourses.length > 0) {
      const deletePrerequisite = prerequisiteCourses.filter(
        prerequisite => prerequisite.courseId && prerequisite.isDeleted
      );
      const newPrerequisite = prerequisiteCourses.filter(
        prerequisite => !(prerequisite.courseId && prerequisite.isDeleted)
      );
      // console.log(newPrerequisite);
      // now let's  delete and create from detebase
      // since  here is multiple action so need to use transanction
      // delete operation
      await asyncForEach(
        deletePrerequisite,
        async (deletePrerequisite: IPrerequisiteCourseRequest) => {
          await transanctionClient.courseToPrerequisite.deleteMany({
            where: {
              AND: [
                {
                  courseId: id,
                },
                {
                  prerequisiteId: deletePrerequisite.courseId,
                },
              ],
            },
          });
        }
      );
      // create operation
      await asyncForEach(
        newPrerequisite,
        async (newPrerequisiteCourse: IPrerequisiteCourseRequest) => {
          await transanctionClient.courseToPrerequisite.create({
            data: {
              courseId: id,
              prerequisiteId: newPrerequisiteCourse.courseId,
            },
          });
        }
      );
    }
    return result;
  });
  const responseData = await prisma.course.findUnique({
    where: {
      id: id,
    },
    include: {
      prerequisite: {
        include: {
          prerequisite: true,
        },
      },
      prerequisiteFor: {
        include: {
          prerequisite: true,
        },
      },
    },
  });
  return responseData;
};
const getAllCourses = async (
  filters: ICourseFilterableFields,
  options: IPaginationOptions
): Promise<IGenericResponse<Course[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: CourseSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereConditions: Prisma.CourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const { sortBy, sortOrder } = options;
  const result = await prisma.course.findMany({
    where: whereConditions,
    include: {
      prerequisite: {
        include: {
          prerequisite: true,
        },
      },
      prerequisiteFor: {
        include: {
          course: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [options.sortBy as any]: options.sortOrder,
          }
        : { createdAt: 'desc' },
  });
  // console.log('I am groot', filters);
  const total = await prisma.course.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
export const CourseService = {
  insertIntoDb,
  getAllCourses,
  updateOneInDb,
};
