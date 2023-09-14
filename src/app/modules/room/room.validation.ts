import { z } from 'zod';

const roomZodValidation = z.object({
  body: z.object({
    roomNumber: z.string({ required_error: 'Room number is required.' }),
    floor: z.string({ required_error: 'Floor is required.' }),
    buildingId: z.string({ required_error: 'BuildingId is required.' }),
  }),
});
export const RoomValidation = {
  roomZodValidation,
};
