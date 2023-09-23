import {
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentSemesterRegistration,
} from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const insertIntoDb = async (
  data: SemesterRegistration
): Promise<SemesterRegistration> => {
  const isSemesterOngoingOrUpcoming =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.UPCOMING,
          },
          {
            status: SemesterRegistrationStatus.ONGOING,
          },
        ],
      },
    });
  if (isSemesterOngoingOrUpcoming) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Already and ${isSemesterOngoingOrUpcoming.status} registration.`
    );
  }
  const result = await prisma.semesterRegistration.create({
    data,
  });
  return result;
};
const updateToDb = async (
  id: string,
  payload: Partial<SemesterRegistration>
) => {
  // console.log(payload.status);
  const isExist = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });
  if (!isExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Semester registration does not exist.'
    );
  }
  if (
    payload.status &&
    isExist.status === SemesterRegistrationStatus.UPCOMING &&
    payload.status !== SemesterRegistrationStatus.ONGOING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can only move from upcoming to ongoing.'
    );
  }
  if (
    payload.status &&
    isExist.status === SemesterRegistrationStatus.ONGOING &&
    payload.status !== SemesterRegistrationStatus.ENDED
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can only move from ongoing to ended.'
    );
  }
  const result = await prisma.semesterRegistration.update({
    where: { id },
    data: payload,
    include: {
      academicSemester: true,
    },
  });
  return result;
};
const deleteFromDb = async (id: string) => {
  const result = await prisma.semesterRegistration.delete({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });
  return result;
};
const startMyRegistration = async (
  authorUserId: string
): Promise<{
  studentSemesterRegistration: StudentSemesterRegistration | null;
  semesterRegistration: SemesterRegistration | null;
}> => {
  const studentInfo = await prisma.student.findFirst({
    where: {
      studentId: authorUserId,
    },
  });
  if (!studentInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student data not found.');
  }
  const semesterRegistrationInfo = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.ONGOING,
          SemesterRegistrationStatus.UPCOMING,
        ],
      },
    },
  });
  // console.log(semesterRegistrationInfo);
  if (
    semesterRegistrationInfo?.status === SemesterRegistrationStatus.UPCOMING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Registration did not start yet.'
    );
  }
  let studentRegistration = await prisma.studentSemesterRegistration.findFirst({
    where: {
      student: {
        id: studentInfo.id,
      },
      semesterRegistration: {
        id: semesterRegistrationInfo?.id,
      },
    },
  });
  if (studentRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student is already registered.'
    );
  }
  if (!studentRegistration) {
    studentRegistration = await prisma.studentSemesterRegistration.create({
      data: {
        student: {
          connect: {
            id: studentInfo?.id,
          },
        },
        semesterRegistration: {
          connect: {
            id: semesterRegistrationInfo?.id,
          },
        },
      },
    });
    // return studentRegistration;
  }
  return {
    semesterRegistration: semesterRegistrationInfo,
    studentSemesterRegistration: studentRegistration,
  };
};
const enrollToCourse = async (userId: string, payload: any) => {
  // console.log("UserId , from token", userId);
  const student = await prisma.student.findFirst({
    where: {
      studentId: userId
    }
  });
  // console.log("got the result", student);
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING
    }
  });
  // console.log(semesterRegistration);
  if (!student) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No student found.");
  }
  if (!semesterRegistration) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No semesterRegistration found.");
  }
  const enrollIntoCourse = await prisma.studentSemesterRegistrationCourse.create({
    data: {
      studentId: student?.id,
      semesterRegistrationId: semesterRegistration?.id,
      offeredCourseId: payload.offeredCourseId,
      offeredCourseSectionId: payload.offeredCourseSectionId,
    }
  });
  return enrollIntoCourse;
};
export const semesterRegistrationService = {
  insertIntoDb,
  updateToDb,
  deleteFromDb,
  startMyRegistration,
  enrollToCourse
};
