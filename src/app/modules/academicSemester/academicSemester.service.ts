import { AcademicSemester, Prisma, PrismaClient } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IAcademicSemesterFilterRequest } from './academicSemester.interface';
import { AcademicSemesterSearchableFields } from './academicSemester.constrants';
import { object } from 'zod';

const prisma = new PrismaClient();

const insertIntoDb = async (
  academicSemesterData: AcademicSemester
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.create({
    data: academicSemesterData,
  });
  return result;
};

const getAllFromDb = async (
  filters: IAcademicSemesterFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<AcademicSemester[]>> => {
  const { page, skip, limit } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  // console.log('filterData', filterData);
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: AcademicSemesterSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditions: Prisma.AcademicSemesterWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.academicSemester.findMany({
    where: whereConditions,
    skip,
    take: limit,
  });
  // console.log('I am groot', filters);
  const total = await prisma.academicSemester.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
export const AcademicSemesterService = {
  insertIntoDb,
  getAllFromDb,
};
