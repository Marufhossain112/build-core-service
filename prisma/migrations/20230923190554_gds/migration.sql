/*
  Warnings:

  - Changed the type of `credits` on the `courses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "credits",
ADD COLUMN     "credits" INTEGER NOT NULL;
