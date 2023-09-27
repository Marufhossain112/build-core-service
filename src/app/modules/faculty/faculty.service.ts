import { CourseFaculty, Faculty, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { IFacultyFilterRequest } from './faculty.interface';
import { FacultySearchableFields } from './faculty.constrants';
import bcrypt from 'bcrypt';
import { ILoginUser } from '../student/student.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';

const insertIntoDb = async (FacultyData: Faculty): Promise<Faculty> => {
  const saltRounds = 10; // You can adjust the number of rounds for security
  const salt = await bcrypt.genSalt(saltRounds);
  console.log("faultysalt", salt);
  // Hash the user's password with the generated salt
  const hashedPassword = await bcrypt.hash(FacultyData.password, salt);
  // console.log("hashedPassword", FacultyData.password);
  const result = await prisma.faculty.create({
    data: {
      ...FacultyData,
      password: hashedPassword,
    },
  });
  return result;
};
const login = async (data: ILoginUser) => {
  const user = await prisma.faculty.findFirst({
    where: {
      email: data?.email,
    },
  });
  const isPasswordMatch = await bcrypt.compare(
    data.password,
    user?.password as string
  );
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password did not match.');
  }
  // create token
  const payload = { role: user?.role, userId: user?.facultyId };
  const token = jwtHelpers.createToken(
    payload,
    config.jwt.secret as string,
    config.jwt.expires_in as string
  );
  return token;
};
const getAllFromDb = async (
  filters: IFacultyFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Faculty[]>> => {
  const { page, skip, limit } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  console.log('filterData', filters);
  // console.log('options', options);

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: FacultySearchableFields.map(field => ({
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
  const whereConditions: Prisma.FacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const { sortBy, sortOrder } = options;
  const result = await prisma.faculty.findMany({
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
  const total = await prisma.faculty.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
const getDataById = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.findUnique({ where: { id } });
  return result;
};

const assignCourses = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: payload.map(courseId => ({
      facultyId: id,
      courseId: courseId,
    })),
  });
  const assignCoursesData = await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: {
      course: true,
    },
  });
  return assignCoursesData;
};
const removeCourses = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[] | null> => {
  await prisma.courseFaculty.deleteMany({
    where: {
      facultyId: id,
      courseId: { in: payload },
    },
  });
  const assignCoursesData = await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: {
      course: true,
    },
  });
  return assignCoursesData;
};

export const FacultyService = {
  insertIntoDb,
  getAllFromDb,
  getDataById,
  assignCourses,
  removeCourses,
  login
};
