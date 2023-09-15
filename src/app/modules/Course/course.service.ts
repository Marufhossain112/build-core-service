import { Course, Prisma } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { ICourseFilterableFields } from './course.interface';
import { IGenericResponse } from '../../../interfaces/common';
import { CourseSearchableFields } from './course.constants';

const insertIntoDb = async (data: Course) => {
  const result = await prisma.course.create({
    data,
  });
  return result;
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
};
