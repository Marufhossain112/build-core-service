export type ICourseFilterableFields = {
  searchTerm?: string;
  title?: string;
  code?: string;
  credits?: string;
};
export type ICourseCreateData = {
  title: string;
  course: string;
  credits: string;
  prerequisiteCourses: {
    courseId: string;
  }[];
};
