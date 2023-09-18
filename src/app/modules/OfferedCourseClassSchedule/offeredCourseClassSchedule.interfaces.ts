export type Slots = {
  startTime: string;
  endTime: string;
  dayOfWeek: string;
};
export type IOfferedCourseClassScheduleFilterRequest = {
  searchTerm?: string | null;
  offeredCourseSectionId?: string | null;
  semesterRegistrationId?: string | null;
  facultyId?: string | null;
  roomId?: string | null;
};
