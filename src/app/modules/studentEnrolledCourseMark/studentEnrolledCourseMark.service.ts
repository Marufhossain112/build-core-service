import { ExamType, PrismaClient } from "@prisma/client";
import { DefaultArgs, PrismaClientOptions } from "@prisma/client/runtime/library";
import { prisma } from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { StudentEnrolledCourseMarkUtils } from "./studentEnrolledCourseMark.utils";

const createStudentEnrolledCourseDefaultMark = async (
    prismaClient: Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, payload: {
        studentId: string,
        academicSemesterId: string,
        studentEnrolledCourseId: string;
    }
) => {
    const isExistMidtermMark = await prismaClient.studentEnrolledCourseMark.findFirst({
        where: {
            examType: ExamType.MIDTERM,
            student: {
                id: payload.studentId
            },
            academicSemester: {
                id: payload.academicSemesterId
            },
            studentEnrolledCourse: {
                id: payload.studentEnrolledCourseId
            }
        }
    });
    if (!isExistMidtermMark) {
        await prismaClient.studentEnrolledCourseMark.create({
            data: {
                student: {
                    connect: {
                        id: payload.studentId
                    }
                },
                academicSemester: {
                    connect: {
                        id: payload.academicSemesterId
                    }
                },
                studentEnrolledCourse: {
                    connect: {
                        id: payload.studentEnrolledCourseId
                    }
                },
                examType: ExamType.MIDTERM
            }
        });
    }
    const isExistFinalMark = await prismaClient.studentEnrolledCourseMark.findFirst({
        where: {
            examType: ExamType.FINAL,
            student: {
                id: payload.studentId
            },
            academicSemester: {
                id: payload.academicSemesterId
            },
            studentEnrolledCourse: {
                id: payload.studentEnrolledCourseId
            }
        }
    });
    if (!isExistFinalMark) {
        await prismaClient.studentEnrolledCourseMark.create({
            data: {
                student: {
                    connect: {
                        id: payload.studentId
                    }
                },
                academicSemester: {
                    connect: {
                        id: payload.academicSemesterId
                    }
                },
                studentEnrolledCourse: {
                    connect: {
                        id: payload.studentEnrolledCourseId
                    }
                },
                examType: ExamType.FINAL
            }
        });
    }
};
const updateStudentMarks = async (payload: any) => {
    // console.log(payload);
    const { studentId, academicSemesterId, examType, marks, courseId } = payload;

    const studentEnrolledCourseMarks = await prisma.studentEnrolledCourseMark.findFirst({
        where: {
            student: {
                id: studentId
            },
            academicSemester: {
                id: academicSemesterId
            }, studentEnrolledCourse: {
                course: { id: courseId }
            }, examType
        }
    });
    if (!studentEnrolledCourseMarks) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Student enrolled marks not found.");
    }
    const result = StudentEnrolledCourseMarkUtils.studentEnrolledCourseMarkGrade(marks);
    const updateStudentMarks = await prisma.studentEnrolledCourseMark.update({
        where: {
            id: studentEnrolledCourseMarks.id
        }, data: {
            marks, grade: result.grade
        }
    });
    return updateStudentMarks;
};
const updateFinalMarks = async (payload: any) => {
    console.log(payload);
    // return payload;
};

export const StudentEnrolledCourseMarkService = {
    createStudentEnrolledCourseDefaultMark,
    updateStudentMarks,
    updateFinalMarks
};