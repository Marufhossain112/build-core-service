-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'faculty';

-- AlterTable
ALTER TABLE "faculties" ADD COLUMN     "password" TEXT NOT NULL DEFAULT '112022';
