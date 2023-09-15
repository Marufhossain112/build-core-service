import { z } from 'zod';

const courseCreateValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title number is required.' }),
    code: z.string({ required_error: 'code is required.' }),
    credits: z.string({ required_error: 'credits is required.' }),
  }),
});
const courseUpdateValidation = z.object({
  body: z.object({
    title: z.string().optional(),
    code: z.string().optional(),
    credits: z.string().optional(),
  }),
});
export const CourseValidation = {
  courseCreateValidation,
  courseUpdateValidation,
};
