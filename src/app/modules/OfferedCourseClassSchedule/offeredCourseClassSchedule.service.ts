/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from './../../../shared/prisma';
import { OfferedCourseClassSchedule, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import {
  OfferedCourseClassScheduleSearchableFields,
  OfferedCourseClassScheduleRelationalFields,
  OfferedCourseClassScheduleRelationalFieldsMapper,
} from './offeredCourseClassSchedule.constants';
import { IOfferedCourseClassScheduleFilterRequest } from './offeredCourseClassSchedule.interfaces';
import { availabilityCheck } from './offeredCourseClassSchedule.utils';

const insertIntoDB = async (
  data: OfferedCourseClassSchedule
): Promise<OfferedCourseClassSchedule> => {
  // await availabilityCheck.roomAvailibiltyCheck(data);
  await availabilityCheck.facultyAvailibiltyCheck(data);
  const result = await prisma.offeredCourseClassSchedule.create({
    data,
    include: {
      faculty: true,
      offeredCourseSection: true,
      room: true,
      semesterRegistration: true,
    },
  });
  return result;
};
const getAllFromDb = async (
  filters: IOfferedCourseClassScheduleFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<OfferedCourseClassSchedule[]>> => {
  const { page, skip, limit } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  console.log('filterData', filters);
  // console.log('options', options);

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: OfferedCourseClassScheduleSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  // console.log('dd', filterData);
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (OfferedCourseClassScheduleRelationalFields.includes(key)) {
          return {
            [OfferedCourseClassScheduleRelationalFieldsMapper[
              key as keyof typeof OfferedCourseClassScheduleRelationalFieldsMapper
            ]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }
  const whereConditions: Prisma.OfferedCourseClassScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const { sortBy, sortOrder } = options;
  const result = await prisma.offeredCourseClassSchedule.findMany({
    include: {
      faculty: true,
      offeredCourseSection: true,
      room: true,
      semesterRegistration: true,
    },
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
  const total = await prisma.offeredCourseClassSchedule.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
export const OfferedCourseClassScheduleService = {
  insertIntoDB,
  getAllFromDb,
};
