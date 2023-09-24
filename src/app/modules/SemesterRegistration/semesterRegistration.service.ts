import {
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentSemesterRegistration,
} from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { IEnrollCoursePayload } from './semesterRegistration.interface';

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
  // console.log("UserId , from token", userId);
  const student = await prisma.student.findFirst({
    where: {
      studentId: userId
    }
  });
  // console.log("got the student", student);
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING
    }
  });
  // console.log('got the semester registration', semesterRegistration);
  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId
    }, include: {
      course: true
    }
  });
  // console.log('got the offeredCourse', offeredCourse);
  const offeredCourseSection = await prisma.offeredCourseSection.findFirst({
    where: {
      id: payload.offeredCourseSectionId
    }
  });
  // console.log('got the offeredCourseSection', offeredCourseSection);
  if (
    offeredCourseSection?.maxCapacity && offeredCourseSection.currentlyEnrolledStudent && offeredCourseSection.currentlyEnrolledStudent >= offeredCourseSection.maxCapacity
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Capacity is full.");
  }
  if (!student) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No student found.");
  }
  if (!semesterRegistration) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No semesterRegistration found.");
  }
  if (!offeredCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No offeredCourse found.");
  }
  if (!offeredCourseSection) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No offeredCourseSection found.");
  }

  await prisma.$transaction(async (transanctionClient) => {
    await transanctionClient.studentSemesterRegistrationCourse.create({
      data: {
        studentId: student?.id,
        semesterRegistrationId: semesterRegistration?.id,
        offeredCourseId: payload.offeredCourseId,
        offeredCourseSectionId: payload.offeredCourseSectionId,
      },

    });
    await transanctionClient.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId
      }, data: {
        currentlyEnrolledStudent: {
          increment: 1
        }
      }
    });
    await transanctionClient.studentSemesterRegistration.updateMany({
      where: {
        student: {
          id: student.id
        },
        semesterRegistration: {
          id: semesterRegistration.id
        }
      }, data: {
        totalCreditsTaken: {
          increment: offeredCourse.course.credits
        }
      }
    });
  });
  return {
    message: "Successfully enrolled into course."
  };
};

const withdrawFromCourse = async (userId: string, payload: IEnrollCoursePayload) => {
  // console.log("UserId , from token", userId);
  const student = await prisma.student.findFirst({
    where: {
      studentId: userId
    }
  });
  // console.log("got the student", student);
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING
    }
  });
  // console.log('got the semester registration', semesterRegistration);
  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId
    }, include: {
      course: true
    }
  });
  // console.log('got the offeredCourse', offeredCourse);

  if (!student) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No student found.");
  }
  if (!semesterRegistration) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No semesterRegistration found.");
  }
  if (!offeredCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No offeredCourse found.");
  }
  await prisma.$transaction(async (transanctionClient) => {
    await transanctionClient.studentSemesterRegistrationCourse.delete({
      where: {
        semesterRegistrationId_studentId_offeredCourseId: {
          studentId: student?.id,
          semesterRegistrationId: semesterRegistration?.id,
          offeredCourseId: payload.offeredCourseId,
        }
      }
    });
    await transanctionClient.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId
      }, data: {
        currentlyEnrolledStudent: {
          decrement: 1
        }
      }
    });
    await transanctionClient.studentSemesterRegistration.updateMany({
      where: {
        student: {
          id: student.id
        },
        semesterRegistration: {
          id: semesterRegistration.id
        }
      }, data: {
        totalCreditsTaken: {
          decrement: offeredCourse.course.credits
        }
      }
    });
  });
  return {
    message: "Successfully withdrawed from the course."
  };
};
export const semesterRegistrationService = {
  insertIntoDb,
  updateToDb,
  deleteFromDb,
  startMyRegistration,
  enrollToCourse,
  withdrawFromCourse
};
