export const OfferedCourseClassScheduleSearchableFields = ['dayOfWeek'];
export const OfferedCourseClassScheduleRelationalFields = [
  'offeredCourseSectionId',
  'semesterRegistrationId',
  'roomId',
  'facultyId',
];
export const OfferedCourseClassScheduleRelationalFieldsMapper = {
  offeredCourseSectionId: 'offeredCourseSection',
  semesterRegistrationId: 'semesterRegistration',
  roomId: 'room',
  facultyId: 'faculty',
};
export const OfferedCourseClassScheduleFilterRequest = [
  'searchTerm',
  'offeredCourseSectionId',
  'semesterRegistrationId',
  'facultyId',
  'roomId',
];
