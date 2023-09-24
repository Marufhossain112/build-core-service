import { SemesterRegistrationStatus } from "@prisma/client";
import { prisma } from "../../../shared/prisma";
import { IEnrollCoursePayload } from "../SemesterRegistration/semesterRegistration.interface";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

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
        message: "Successfully withdrawn from the course."
    };
};
export const StudentSemesterRegistrationService = {
    enrollToCourse,
    withdrawFromCourse
};