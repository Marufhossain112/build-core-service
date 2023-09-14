import { IGenericResponse } from './../../../interfaces/common';
import { Building, Prisma } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { IBuildingFilterableFields } from './building.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { BuildingSearchableFields } from './building.constants';

const insertToDb = async (data: Building): Promise<Building> => {
  const result = await prisma.building.create({ data });
  return result;
};
const getAllBuildings = async (
  filters: IBuildingFilterableFields,
  options: IPaginationOptions
): Promise<IGenericResponse<Building[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: BuildingSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereConditions: Prisma.BuildingWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const { sortBy, sortOrder } = options;
  const result = await prisma.building.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [options.sortBy as any]: options.sortOrder,
          }
        : { createdAt: 'desc' },
  });
  // console.log('I am groot', filters);
  const total = await prisma.building.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const BuildingService = {
  insertToDb,
  getAllBuildings,
};
