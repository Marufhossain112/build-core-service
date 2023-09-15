import { z } from 'zod';

const courseZodValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title number is required.' }),
    code: z.string({ required_error: 'code is required.' }),
    credits: z.string({ required_error: 'credits is required.' }),
  }),
});
export const CourseValidation = {
  courseZodValidation,
};
