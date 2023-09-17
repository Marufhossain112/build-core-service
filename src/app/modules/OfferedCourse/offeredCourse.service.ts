import { OfferedCourse } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { IOfferedCourse } from './offeredCourse.interface';

const insertIntoDb = async (data: IOfferedCourse): Promise<OfferedCourse[]> => {
  const { academicDepartmentId, semesterRegistrationId, courseIds } = data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: OfferedCourse[] = [];
  await asyncForEach(courseIds, async (courseId: string) => {
    const alreadyExist = await prisma.offeredCourse.findFirst({
      where: {
        academicDepartmentId,
        semesterRegistrationId,
        courseId,
      },
      include: {
        academicDepartment: true,
        semesterRegistration: true,
        course: true,
      },
    });
    // if (alreadyExist) {
    //   throw new ApiError(httpStatus.BAD_REQUEST, 'Already course offered.');
    // }
    if (!alreadyExist) {
      const insertOfferedCourseData = await prisma.offeredCourse.create({
        data: {
          academicDepartmentId,
          semesterRegistrationId,
          courseId,
        },
      });
      result.push(insertOfferedCourseData);
    }
  });
  return result;
};
export const OfferedCourseService = {
  insertIntoDb,
};
