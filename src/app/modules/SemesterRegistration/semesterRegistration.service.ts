import {
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentSemesterRegistration,
} from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { IEnrollCoursePayload } from './semesterRegistration.interface';
import { StudentSemesterRegistrationService } from '../StudentSemesterRegistration/studentSemesterRegistration.service';

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
      httpStatus.NOT_FOUND,
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
const enrollToCourse = async (userId: string, payload: IEnrollCoursePayload) => {
  return StudentSemesterRegistrationService.enrollToCourse(userId, payload);
};

const withdrawFromCourse = async (userId: string, payload: IEnrollCoursePayload) => {
  return StudentSemesterRegistrationService.withdrawFromCourse(userId, payload);
};

const confirmMyRegistration = async (userId: string) => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING
    }
  });
  const studentSemesterRegistration = await prisma.studentSemesterRegistration.findFirst({
    where: {
      semesterRegistration: {
        id: semesterRegistration?.id
      },
      student: {
        studentId: userId
      }
    }
  });
  if (!semesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, "No semesterRegistration found.");
  }
  if (!studentSemesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, "No studentSemesterRegistration found.");
  }
  if (studentSemesterRegistration.totalCreditsTaken && semesterRegistration.minCredit && semesterRegistration.maxCredit && (studentSemesterRegistration.totalCreditsTaken < semesterRegistration.minCredit || studentSemesterRegistration.totalCreditsTaken < semesterRegistration.maxCredit)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `You can only take ${semesterRegistration.minCredit} to ${semesterRegistration.maxCredit} courses.`);
  }
  if (studentSemesterRegistration.totalCreditsTaken === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "You have not enrolled on any course yet.");
  }
  await prisma.studentSemesterRegistration.update({
    where: {
      id: studentSemesterRegistration.id
    }, data: {
      isConfirmed: true
    }
  });
  return {
    message: "Your registration is confirmed."
  };
  // console.log("semesterRegistration", semesterRegistration);
  // console.log("StudentSemesterRegistration", studentSemesterRegistration);
};
export const semesterRegistrationService = {
  insertIntoDb,
  updateToDb,
  deleteFromDb,
  startMyRegistration,
  enrollToCourse,
  withdrawFromCourse,
  confirmMyRegistration
};
