/*
  Warnings:

  - You are about to drop the column `fullname` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "fullname",
ADD COLUMN     "name" TEXT;
