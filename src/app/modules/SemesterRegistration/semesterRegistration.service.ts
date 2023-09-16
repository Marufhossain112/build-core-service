import {
  SemesterRegistration,
  SemesterRegistrationStatus,
} from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const insertIntoDb = async (
  data: SemesterRegistration
): Promise<SemesterRegistration> => {
  const isSemesterOngoingOrUpcoming =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.UPCOMING,
          },
          {
            status: SemesterRegistrationStatus.ONGOING,
          },
        ],
      },
    });
  if (isSemesterOngoingOrUpcoming) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Already and ${isSemesterOngoingOrUpcoming.status} registration.`
    );
  }
  const result = await prisma.semesterRegistration.create({
    data,
  });
  return result;
};
const updateToDb = async (
  id: string,
  payload: Partial<SemesterRegistration>
) => {
  const result = await prisma.semesterRegistration.update({
    where: { id },
    data: payload,
    include: {
      academicSemester: true,
    },
  });
  return result;
};
export const semesterRegistrationService = {
  insertIntoDb,
  updateToDb,
};
