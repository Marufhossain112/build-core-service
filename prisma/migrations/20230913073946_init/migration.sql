/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `academic_departments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `academic_faculty` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `academicDepartmentId` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicFacultyId` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicDepartmentId` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicFacultyId` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicSemesterId` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "academic_semesters" ADD COLUMN     "isCurrent" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "faculties" ADD COLUMN     "academicDepartmentId" TEXT NOT NULL,
ADD COLUMN     "academicFacultyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "academicDepartmentId" TEXT NOT NULL,
ADD COLUMN     "academicFacultyId" TEXT NOT NULL,
ADD COLUMN     "academicSemesterId" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "academic_departments";

-- DropTable
DROP TABLE "academic_faculty";

-- CreateTable
CREATE TABLE "academic_faculties" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_faculties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_department" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "academicFacultyId" TEXT NOT NULL,

    CONSTRAINT "academic_department_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "academic_department" ADD CONSTRAINT "academic_department_academicFacultyId_fkey" FOREIGN KEY ("academicFacultyId") REFERENCES "academic_faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_academicDepartmentId_fkey" FOREIGN KEY ("academicDepartmentId") REFERENCES "academic_department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_academicFacultyId_fkey" FOREIGN KEY ("academicFacultyId") REFERENCES "academic_faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculties" ADD CONSTRAINT "faculties_academicDepartmentId_fkey" FOREIGN KEY ("academicDepartmentId") REFERENCES "academic_department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculties" ADD CONSTRAINT "faculties_academicFacultyId_fkey" FOREIGN KEY ("academicFacultyId") REFERENCES "academic_faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
