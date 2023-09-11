/*
  Warnings:

  - You are about to drop the column `academicFacultyId` on the `academic_semesters` table. All the data in the column will be lost.
  - Changed the type of `year` on the `academic_semesters` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "academic_semesters" DROP CONSTRAINT "academic_semesters_academicFacultyId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_academicSemesterId_fkey";

-- AlterTable
ALTER TABLE "academic_semesters" DROP COLUMN "academicFacultyId",
DROP COLUMN "year",
ADD COLUMN     "year" INTEGER NOT NULL,
ALTER COLUMN "startMonth" SET DATA TYPE TEXT,
ALTER COLUMN "endMonth" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "faculties" ALTER COLUMN "contactNo" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "students" ALTER COLUMN "contactNo" SET DATA TYPE TEXT;
