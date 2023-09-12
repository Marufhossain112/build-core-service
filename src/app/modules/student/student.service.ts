import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Prisma, Student } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { IStudentFilterRequest } from './student.interface';
import { StudentSearchableFields } from './student.constrants';

const insertIntoDb = async (StudentData: Student): Promise<Student> => {
  const result = await prisma.student.create({
    data: StudentData,
  });
  return result;
};

const getAllFromDb = async (
  filters: IStudentFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Student[]>> => {
  const { page, skip, limit } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  console.log('filterData', filters);
  // console.log('options', options);

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: StudentSearchableFields.map(field => ({
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
  const whereConditions: Prisma.StudentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const { sortBy, sortOrder } = options;
  const result = await prisma.student.findMany({
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
  const total = await prisma.student.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
const getDataById = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.findUnique({ where: { id } });
  return result;
};

export const StudentService = {
  insertIntoDb,
  getAllFromDb,
  getDataById,
};
