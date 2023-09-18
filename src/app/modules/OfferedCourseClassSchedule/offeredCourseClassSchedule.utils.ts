import { OfferedCourseClassSchedule } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { isScheduleConflicted } from '../../../shared/utils';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const roomAvailibiltyCheck = async (data: OfferedCourseClassSchedule) => {
  const alreadyBookedRoomOnDay =
    await prisma.offeredCourseClassSchedule.findMany({
      where: { dayOfWeek: data.dayOfWeek, room: { id: data.roomId } },
    });
  // console.log(alreadyBookedRoomOnDay);
  const existingSlots = alreadyBookedRoomOnDay.map(schedule => ({
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    dayOfWeek: schedule.dayOfWeek,
  }));
  // console.log(existingSlots);
  const newSlot = {
    startTime: data.startTime,
    endTime: data.endTime,
    dayOfWeek: data.dayOfWeek,
  };
  // console.log('New_slot', newSlot);
  // console.log('Existing_slot', existingSlots);
  if (isScheduleConflicted(existingSlots, newSlot)) {
    throw new ApiError(httpStatus.CONFLICT, 'Schedule already exists.');
  }
};
const facultyAvailibiltyCheck = async (data: OfferedCourseClassSchedule) => {
  const alreadyBookedFacultyOnDay =
    await prisma.offeredCourseClassSchedule.findMany({
      where: { dayOfWeek: data.dayOfWeek, faculty: { id: data.facultyId } },
    });
  // console.log(alreadyBookedFacultyOnDay);
  const existingSlots = alreadyBookedFacultyOnDay.map(schedule => ({
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    dayOfWeek: schedule.dayOfWeek,
  }));
  // console.log(existingSlots);
  const newSlot = {
    startTime: data.startTime,
    endTime: data.endTime,
    dayOfWeek: data.dayOfWeek,
  };
  // console.log('New_slot', newSlot);
  // console.log('Existing_slot', existingSlots);
  if (isScheduleConflicted(existingSlots, newSlot)) {
    throw new ApiError(httpStatus.CONFLICT, 'Faculty already exists.');
  }
};
export const availabilityCheck = {
  roomAvailibiltyCheck,
  facultyAvailibiltyCheck,
};
