import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';

import { prisma } from '../../../shared/prisma';
import { IAcademicFacultyFilterRequest } from './academicFaculty.interface';
import { AcademicFacultySearchableFields } from './academicFaculty.constrants';
import { AcademicFaculty, Prisma } from '@prisma/client';

const insertIntoDb = async (
  academicFacultyData: AcademicFaculty
): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.create({
    data: academicFacultyData,
  });
  return result;
};

const getAllFromDb = async (
  filters: IAcademicFacultyFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<AcademicFaculty[]>> => {
  const { page, skip, limit } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  // console.log('filterData', filterData);
  // console.log('options', options);

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: AcademicFacultySearchableFields.map(field => ({
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
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditions: Prisma.AcademicFacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const { sortBy, sortOrder } = options;
  const result = await prisma.academicFaculty.findMany({
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
  const total = await prisma.academicFaculty.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
const getDataById = async (id: string): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.findUnique({ where: { id } });
  return result;
};

export const AcademicFacultyService = {
  insertIntoDb,
  getAllFromDb,
  getDataById,
};
