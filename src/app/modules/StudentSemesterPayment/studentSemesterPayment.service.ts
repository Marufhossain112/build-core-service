import { PrismaClient } from "@prisma/client";
import { DefaultArgs, PrismaClientOptions } from "@prisma/client/runtime/library";
import { prisma } from "../../../shared/prisma";

const createSemesterPayment = async (
    prismaClient: Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">,
    payload: {
        studentId: string,
        academicSemesterId: string,
        totalPaymentAmount: number;
    }
) => {
    // console.log(payload);
    const dataToInsert = {
        studentId: payload.studentId,
        academicSemesterId: payload.academicSemesterId,
        fullPaymentAmount: payload.totalPaymentAmount,
        partialPaymentAmount: payload.totalPaymentAmount * 0.5,
        totalDueAmount: payload.totalPaymentAmount,
        totalPaidAmount: 0,
    };
    await prisma.studentSemesterPayment.create({
        data: dataToInsert
    });
};
export const StudentSemesterPaymentService = {
    createSemesterPayment
};