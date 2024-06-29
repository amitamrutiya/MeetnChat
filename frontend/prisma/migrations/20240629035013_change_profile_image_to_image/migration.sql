/*
  Warnings:

  - You are about to drop the column `profile_image` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "profile_image",
ADD COLUMN     "image" TEXT;
