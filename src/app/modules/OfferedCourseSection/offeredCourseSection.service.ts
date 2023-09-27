/* eslint-disable @typescript-eslint/no-explicit-any */
import { OfferedCourseSection } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { asyncForEach } from '../../../shared/utils';
import { availabilityCheck } from '../OfferedCourseClassSchedule/offeredCourseClassSchedule.utils';
import { IOfferedCourseSection } from './offeredCourseSection.interfaces';

const insertIntoDB = async (payload: IOfferedCourseSection): Promise<OfferedCourseSection | null> => {
  const { classSchedules, ...data } = payload;
  const isExistOfferedCourse = await prisma.offeredCourse.findFirst({
    where: { id: data.offeredCourseId },
  });
  if (!isExistOfferedCourse) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Offered course does not exist.'
    );
  }
  // console.log('data', payload);
  await asyncForEach(
    classSchedules,
    async (schedule: any) => {
      // console.log("schedule", schedule);
      await availabilityCheck.roomAvailibiltyCheck(schedule);
      await availabilityCheck.facultyAvailibiltyCheck(schedule);
    }
  );
  const offeredCourseSectionData = await prisma.offeredCourseSection.findFirst({
    where: {
      offeredCourse: {
        id: data.offeredCourseId
      },
      title: data.title
    }
  });
  if (offeredCourseSectionData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Offered course  already exist.");
  }
  const createSection = await prisma.$transaction(async (transactionClient) => {
    const createOfferedCourseSection = await transactionClient.offeredCourseSection.create({
      data: {
        title: data.title,
        maxCapacity: data.maxCapacity,
        offeredCourseId: data.offeredCourseId,
        semesterRegistrationId: isExistOfferedCourse.semesterRegistrationId
      }
    });
    const scheduleData = classSchedules.map((schedule: any) => ({
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      dayOfWeek: schedule.dayOfWeek,
      roomId: schedule.roomId,
      facultyId: schedule.facultyId,
      offeredCourseSectionId: createOfferedCourseSection.id,
      semesterRegistrationId: isExistOfferedCourse.semesterRegistrationId
    }));
    // console.log(scheduleData);
    await transactionClient.offeredCourseClassSchedule.createMany({
      data: scheduleData
    });
    return createOfferedCourseSection;
  });
  const result = await prisma.offeredCourseSection.findFirst({
    where: {
      id: createSection.id
    },
    include: {
      offeredCourse: {
        include: {
          course: true
        }
      },
      offeredCourseClassSchedules: {
        include: {
          room: {
            include: {
              building: true
            }
          }, faculty: true
        }
      }
    }
  });
  return result;
};
export const OfferedCourseSectionService = {
  insertIntoDB,
};
