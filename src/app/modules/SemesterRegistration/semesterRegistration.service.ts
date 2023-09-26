import {
  Course,
  OfferedCourse,
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentSemesterRegistration,
  StudentSemesterRegistrationCourse,
} from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { IEnrollCoursePayload } from './semesterRegistration.interface';
import { StudentSemesterRegistrationService } from '../StudentSemesterRegistration/studentSemesterRegistration.service';
import { asyncForEach } from '../../../shared/utils';
import { StudentSemesterPaymentService } from '../StudentSemesterPayment/studentSemesterPayment.service';
import { StudentEnrolledCourseMarkService } from '../studentEnrolledCourseMark/studentEnrolledCourseMark.service';

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
  if (studentSemesterRegistration.totalCreditsTaken && semesterRegistration.minCredit && semesterRegistration.maxCredit && (studentSemesterRegistration.totalCreditsTaken < semesterRegistration.minCredit || studentSemesterRegistration.totalCreditsTaken > semesterRegistration.maxCredit)) {
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
const getMyRegistration = async (userId: string) => {
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
  return { semesterRegistration, studentSemesterRegistration };
};
// const startNewSemester = async (id: string): Promise<{ message: string; }> => {
//   // console.log(id);
//   const semesterRegistration = await prisma.semesterRegistration.findUnique({
//     where: { id }, include: { academicSemester: true }
//   });
//   if (!semesterRegistration) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "No semester found.");
//   }
//   if (semesterRegistration.status !== SemesterRegistrationStatus.ENDED) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Semester is not ended yet. ");
//   }
//   // if (semesterRegistration.academicSemester.isCurrent) {
//   //   throw new ApiError(httpStatus.BAD_REQUEST, "Semester is already started. ");
//   // }
//   await prisma.$transaction(async (transactionClient) => {
//     await transactionClient.academicSemester.updateMany({
//       where: { isCurrent: true }, data: { isCurrent: false }
//     });
//     await transactionClient.academicSemester.update({
//       where: {
//         id: semesterRegistration.academicSemester.id
//       }, data: {
//         isCurrent: true
//       }
//     });
//     const studentSemesterRegistrations = await prisma.studentSemesterRegistration.findMany({
//       where: {
//         semesterRegistration: {
//           id
//         },
//         isConfirmed: true
//       }
//     });
//     // console.log(Array.isArray(studentSemesterRegistration));
//     // console.log(studentSemesterRegistrations);
//     asyncForEach(
//       studentSemesterRegistrations,
//       async (studentReg: StudentSemesterRegistration) => {
//         // console.log(studentReg);
//         if (studentReg.totalCreditsTaken) {
//           const totalPaymentAmount = studentReg.totalCreditsTaken * 5000;
//           await StudentSemesterPaymentService.createSemesterPayment(transactionClient, {
//             studentId: studentReg.studentId,
//             academicSemesterId: semesterRegistration.academicSemesterId,
//             totalPaymentAmount: totalPaymentAmount
//           });
//         }
//         const studentSemesterRegistrationCourses = await prisma.studentSemesterRegistrationCourse.findMany({
//           where: {
//             semesterRegistration: {
//               id: studentReg.semesterRegistrationId
//             },
//             student: {
//               id: studentReg.studentId
//             }
//           },
//           include: {
//             offeredCourse: {
//               include: {
//                 course: true
//               }
//             }
//           }
//         });
//         // console.log(studentSemesterRegistrationCourses);
//         asyncForEach(
//           studentSemesterRegistrationCourses,
//           async (item: StudentSemesterRegistrationCourse & {
//             offeredCourse: OfferedCourse & {
//               course: Course;
//             };
//           }) => {
//             const isExistEnrolledCourse = await prisma.studentEnrolledCourse.findFirst({
//               where: {
//                 studentId: item.studentId,
//                 courseId: item.offeredCourse.courseId,
//                 academicSemesterId: semesterRegistration.academicSemesterId
//               }
//             });
//             const enrollCourseData = {
//               studentId: item.studentId,
//               courseId: item.offeredCourse.courseId,
//               academicSemesterId: semesterRegistration.academicSemesterId
//             };
//             if (!isExistEnrolledCourse) {
//               await prisma.studentEnrolledCourse.create({
//                 data: enrollCourseData
//               });
//             }
//           }
//         );
//       }
//     );
//   });
//   return {
//     message: "Successfully added new semester"
//   };
// };


const startNewSemester = async (
  id: string
): Promise<{
  message: string;
}> => {
  const semesterRegistration = await prisma.semesterRegistration.findUnique({
    where: {
      id
    },
    include: {
      academicSemester: true
    }
  });

  if (!semesterRegistration) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Semester Registration Not found!");
  }

  if (semesterRegistration.status !== SemesterRegistrationStatus.ENDED) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Semester Registration is not ended yet!");
  }

  // if (semesterRegistration.academicSemester.isCurrent) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, "Semester is already started!");
  // }

  await prisma.$transaction(async (prismaTransactionClient) => {
    await prismaTransactionClient.academicSemester.updateMany({
      where: {
        isCurrent: true
      },
      data: {
        isCurrent: false
      }
    });

    await prismaTransactionClient.academicSemester.update({
      where: {
        id: semesterRegistration.academicSemesterId
      },
      data: {
        isCurrent: true
      }
    });

    const studentSemesterRegistrations = await prisma.studentSemesterRegistration.findMany({
      where: {
        semesterRegistration: {
          id
        },
        isConfirmed: true
      }
    });
    // console.log("ssmreg", studentSemesterRegistrations);

    await asyncForEach(
      studentSemesterRegistrations,
      async (studentSemReg: StudentSemesterRegistration) => {
        if (studentSemReg.totalCreditsTaken) {
          const totalSemesterPaymentAmount = studentSemReg.totalCreditsTaken * 5000;
          // console.log('item', totalSemesterPaymentAmount);
          await StudentSemesterPaymentService.createSemesterPayment(prismaTransactionClient, {
            studentId: studentSemReg.studentId,
            academicSemesterId: semesterRegistration.academicSemesterId,
            totalPaymentAmount: totalSemesterPaymentAmount
          });
        }
        const studentSemesterRegistrationCourses =
          await prismaTransactionClient.studentSemesterRegistrationCourse.findMany({
            where: {
              semesterRegistration: {
                id
              },
              student: {
                id: studentSemReg.studentId
              }
            },
            include: {
              offeredCourse: {
                include: {
                  course: true
                }
              }
            }
          });
        // console.log("item", studentSemesterRegistrationCourses);
        await asyncForEach(
          studentSemesterRegistrationCourses,
          async (
            item: StudentSemesterRegistrationCourse & {
              offeredCourse: OfferedCourse & {
                course: Course;
              };
            }
          ) => {

            const isExistEnrolledData = await prismaTransactionClient.studentEnrolledCourse.findFirst({
              where: {
                student: { id: item.studentId },
                course: { id: item.offeredCourse.courseId },
                academicSemester: { id: semesterRegistration.academicSemesterId }
              }
            });
            // console.log('data',isExistEnrolledData)

            if (!isExistEnrolledData) {
              const enrolledCourseData = {
                studentId: item.studentId,
                courseId: item.offeredCourse.courseId,
                academicSemesterId: semesterRegistration.academicSemesterId
              };
              const studentEnrolledCourseData = await prismaTransactionClient.studentEnrolledCourse.create({
                data: enrolledCourseData
              });
              // console.log('data',enrolledCourseData)
              await StudentEnrolledCourseMarkService.createStudentEnrolledCourseDefaultMark(prismaTransactionClient, {
                studentId: item.studentId,
                academicSemesterId: semesterRegistration.academicSemesterId,
                studentEnrolledCourseId: studentEnrolledCourseData.id
              });
            }
          }
        );
      }
    );
  });
  return {
    message: "Semester started successfully!"
  };
};
export const semesterRegistrationService = {
  insertIntoDb,
  updateToDb,
  deleteFromDb,
  startMyRegistration,
  enrollToCourse,
  withdrawFromCourse,
  confirmMyRegistration,
  getMyRegistration,
  startNewSemester
};
