import { z } from 'zod';

const create = z.object({
  body: z.object({
    academicDepartmentId: z.string({
      required_error: 'academicDepartmentId is required.',
    }),
    semesterRegistrationId: z.string({
      required_error: 'semesterRegistrationId is required.',
    }),
    courseIds: z.array(z.string({ required_error: 'coureId is required' }), {
      required_error: 'coureIds is required',
    }),
  }),
});
export const OfferedCourseValidation = {
  create,
};
