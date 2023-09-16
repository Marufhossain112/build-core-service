import { z } from 'zod';

const createSemesterRegistrationValidation = z.object({
  body: z.object({
    startDate: z.string({ required_error: 'startDate is required.' }),
    endDate: z.string({ required_error: 'endDate is required.' }),
    academicSemesterId: z.string({
      required_error: 'academicSemesterId is required.',
    }),
  }),
});
const updateSemesterRegistrationValidation = z.object({
  body: z.object({
    startDate: z
      .string({ required_error: 'startDate is required.' })
      .optional(),
    endDate: z.string({ required_error: 'endDate is required.' }).optional(),
    academicSemesterId: z
      .string({
        required_error: 'academicSemesterId is required.',
      })
      .optional(),
  }),
});
export const SemesterRegistrationValidation = {
  createSemesterRegistrationValidation,
  updateSemesterRegistrationValidation,
};
