import { prisma } from './../../../shared/prisma';
import { OfferedCourseClassSchedule } from '@prisma/client';
import { isRoomAvailable } from './offeredCourseClassSchedule.utils';

const insertIntoDB = async (
  data: OfferedCourseClassSchedule
): Promise<OfferedCourseClassSchedule> => {
  await isRoomAvailable.roomAvailibiltyCheck(data);
  const result = await prisma.offeredCourseClassSchedule.create({
    data,
    include: {
      faculty: true,
      offeredCourseSection: true,
      room: true,
      semesterRegistration: true,
    },
  });
  return result;
};
export const OfferedCourseClassScheduleService = {
  insertIntoDB,
};
