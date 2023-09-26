import { ExamType, PrismaClient } from "@prisma/client";
import { DefaultArgs, PrismaClientOptions } from "@prisma/client/runtime/library";

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
    console.log(payload);
};
export const StudentEnrolledCourseMarkService = {
    createStudentEnrolledCourseDefaultMark,
    updateStudentMarks
};