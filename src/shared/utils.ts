import { Slots } from '../app/modules/OfferedCourseClassSchedule/offeredCourseClassSchedule.interfaces';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const asyncForEach = async (array: any[], callback: any) => {
  if (!Array.isArray(array)) {
    throw new Error('Expected an array');
  }
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const isScheduleConflicted = (
  existingSlots: Slots[],
  newSlot: Slots
) => {
  for (const slot of existingSlots) {
    const existingStart = new Date(`1999-01-01T${slot.startTime}:00`);
    const existingEnd = new Date(`1999-01-01T${slot.endTime}:00`);
    const newStart = new Date(`1999-01-01T${newSlot.startTime}:00`);
    const newEnd = new Date(`1999-01-01T${newSlot.startTime}:00`);
    if (newStart < existingEnd && newEnd > existingStart) {
      return true;
    }
    return false;
  }
};
