import { Room } from '@prisma/client';
import { prisma } from '../../../shared/prisma';

const insertToDb = async (data: Room) => {
  const result = await prisma.room.create({
    data,
    include: {
      building: true,
    },
  });
  return result;
};
export const RoomService = {
  insertToDb,
};
