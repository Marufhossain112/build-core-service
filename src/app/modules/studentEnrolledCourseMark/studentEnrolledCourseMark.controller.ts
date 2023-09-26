import catchAsync from "../../../shared/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { StudentEnrolledCourseMarkService } from "./studentEnrolledCourseMark.service";
const updateStudentMarks = catchAsync(async (req: Request, res: Response) => {
    const result = await StudentEnrolledCourseMarkService.updateStudentMarks(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Marks updated.',
        data: result,
    });
});
const updateFinalMarks = catchAsync(async (req: Request, res: Response) => {
    const result = await StudentEnrolledCourseMarkService.updateFinalMarks(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Final marks updated.',
        data: result,
    });
});
export const StudentEnrolledCourseMarkController = {
    updateStudentMarks,
    updateFinalMarks
};