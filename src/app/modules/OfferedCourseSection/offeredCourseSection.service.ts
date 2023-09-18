import { OfferedCourseSection } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const insertIntoDB = async (data: any): Promise<OfferedCourseSection> => {
  const isExistOfferedCourse = await prisma.offeredCourse.findFirst({
    where: { id: data.offeredCourseId },
  });
  data.semesterRegistrationId = isExistOfferedCourse?.semesterRegistrationId;
  if (!isExistOfferedCourse) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Offered course does not exist.'
    );
  }
  console.log('Is Exist', isExistOfferedCourse);
  const result = await prisma.offeredCourseSection.create({
    data,
  });
  return result;
};
export const OfferedCourseSectionService = {
  insertIntoDB,
};
