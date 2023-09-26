import { ExamType, PrismaClient } from "@prisma/client";
import { DefaultArgs, PrismaClientOptions } from "@prisma/client/runtime/library";
import { prisma } from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

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
    let grade = '';
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
    if (marks >= 0 && marks <= 39) {
        grade = "F";
    }
    else if (marks >= 40 && marks <= 49) {
        grade = "D";
    }
    else if (marks >= 50 && marks <= 59) {
        grade = "C";
    }
    else if (marks >= 60 && marks <= 69) {
        grade = "B";
    }
    else if (marks >= 70 && marks <= 79) {
        grade = "A";
    }
    else if (marks >= 80 && marks <= 100) {
        grade = "A+";
    }
    const updateStudentMarks = await prisma.studentEnrolledCourseMark.update({
        where: {
            id: studentEnrolledCourseMarks.id
        }, data: {
            marks, grade
        }
    });
    return updateStudentMarks;
};

export const StudentEnrolledCourseMarkService = {
    createStudentEnrolledCourseDefaultMark,
    updateStudentMarks
};