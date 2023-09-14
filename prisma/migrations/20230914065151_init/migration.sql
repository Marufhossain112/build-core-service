/*
  Warnings:

  - Added the required column `title` to the `buildings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "buildings" ADD COLUMN     "title" TEXT NOT NULL;
