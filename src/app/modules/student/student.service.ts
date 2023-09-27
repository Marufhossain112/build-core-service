import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Prisma, Student } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { ILoginUser, IStudentFilterRequest } from './student.interface';
import { StudentSearchableFields } from './student.constrants';
import bcrypt from 'bcrypt';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';

const insertIntoDb = async (StudentData: Student): Promise<Student> => {
  const saltRounds = 10; // You can adjust the number of rounds for security
  const salt = await bcrypt.genSalt(saltRounds);
  console.log("studentsalt", salt);

  // Hash the user's password with the generated salt
  const hashedPassword = await bcrypt.hash(StudentData.password, salt);
  const result = await prisma.student.create({
    data: {
      ...StudentData,
      password: hashedPassword,
    },
    include: {
      academicSemester: true,
      academicDepartment: true,
      academicFaculty: true,
    },
  });
  return result;
};
const login = async (data: ILoginUser) => {
  const user = await prisma.student.findFirst({
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
  const payload = { role: user?.role, userId: user?.studentId };
  const token = jwtHelpers.createToken(
    payload,
    config.jwt.secret as string,
    config.jwt.expires_in as string
  );
  return token;
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
    include: {
      academicSemester: true,
      academicDepartment: true,
      academicFaculty: true,
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
const updateToDb = async (id: string, payload: Partial<Student>) => {
  const result = await prisma.student.update({
    where: { id },
    data: payload,
    include: {
      academicSemester: true,
      academicDepartment: true,
      academicFaculty: true,
    },
  });
  return result;
};
const deleteFromDb = async (id: string) => {
  const result = await prisma.student.delete({
    where: {
      id,
    },
    include: {
      academicSemester: true,
      academicDepartment: true,
      academicFaculty: true,
    },
  });
  return result;
};
const myCourses = async (authUserId: string, filter: {
  courseId?: string | undefined,
  academicSemesterId?: string | undefined;
}) => {
  // console.log("MY courses");
  if (!filter.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true
      }
    });
    filter.academicSemesterId = currentSemester?.id;
  }
  // console.log("Current_semester", currentSemester);
  const result = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        studentId: authUserId
      },
      ...filter
    }, include: {
      course: true
    }
  });
  return result;
};

export const StudentService = {
  insertIntoDb,
  getAllFromDb,
  getDataById,
  updateToDb,
  deleteFromDb,
  login,
  myCourses
};
