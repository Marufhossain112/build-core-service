/*
  Warnings:

  - You are about to drop the column `isCurrent` on the `academic_semesters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "academic_semesters" DROP COLUMN "isCurrent";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
