import { Role } from '@prisma/client';
import { z } from 'zod';
const roleEnumValues = Object.values(Role) as string[];
const create = z.object({
  body: z.object({
    studentId: z.string({
      required_error: 'studentId is required.',
    }), password: z.string({
      required_error: 'password is required.',
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
    role: z.enum([...roleEnumValues] as [string, ...string[]], {
      required_error: 'role is required.',
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
    bloodGroup: z.string({
      required_error: 'bloodGroup is required.',
    }),
    academicSemesterId: z.string({
      required_error: 'academicSemesterId is required.',
    }),
    academicDepartmentId: z.string({
      required_error: 'academicDepartmentId is required.',
    }),
    academicFacultyId: z.string({
      required_error: 'academicFacultyId is required.',
    }),
  }),
});
const login = z.object({
  body: z.object({
    password: z.string({
      required_error: 'password is required.',
    }),
    email: z.string({
      required_error: 'email is required.',
    }),
  }),
});
const update = z.object({
  body: z.object({
    studentId: z.string({}).optional(),
    firstName: z.string({}).optional(),
    middleName: z.string({}).optional(),
    lastName: z.string({}).optional(),
    profileImage: z.string({}).optional(),
    email: z.string({}).optional(),
    contactNo: z.string({}).optional(),
    gender: z.string({}).optional(),
    bloodGroup: z.string({}).optional(),
    academicSemesterId: z.string({}).optional(),
    academicDepartmentId: z.string({}).optional(),
    academicFacultyId: z.string({}).optional(),
  }),
});
export const StudentValidation = {
  login,
  create,
  update,
};
