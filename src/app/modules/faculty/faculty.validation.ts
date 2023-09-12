import { z } from 'zod';
const create = z.object({
  body: z.object({
    facultyId: z.string({
      required_error: 'facultyId is required.',
    }),
    firstName: z.string({
      required_error: 'firstName is required.',
    }),
    middleName: z.string({
      required_error: 'middleName is required.',
    }),
    lastName: z.string({
      required_error: 'lastName is required.',
    }),
    profileImage: z.string({
      required_error: 'profileImage is required.',
    }),
    email: z.string({
      required_error: 'email is required.',
    }),
    contactNo: z.string({
      required_error: 'contactNo is required.',
    }),
    gender: z.string({
      required_error: 'gender is required.',
    }),
    designation: z.string({
      required_error: 'designation is required.',
    }),
    bloodGroup: z.string({
      required_error: 'bloodGroup is required.',
    }),
  }),
});
export const FacultyValidation = {
  create,
};
