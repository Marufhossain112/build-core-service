import { OfferedCourse } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { IOfferedCourse } from './offeredCourse.interface';

const insertIntoDb = async (data: IOfferedCourse): Promise<OfferedCourse[]> => {
  const { academicDepartmentId, semesterRegistrationId, courseIds } = data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any[] = [];
  await asyncForEach(courseIds, async (courseId: string) => {
    const insertOfferedCourseData = await prisma.offeredCourse.create({
      data: {
        academicDepartmentId,
        semesterRegistrationId,
        courseId,
      },
    });
    result.push(insertOfferedCourseData);
  });
  return result;
};
export const OfferedCourseService = {
  insertIntoDb,
};
