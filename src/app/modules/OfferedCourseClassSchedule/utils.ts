import { Slots } from './offeredCourseClassSchedule.interfaces';

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
