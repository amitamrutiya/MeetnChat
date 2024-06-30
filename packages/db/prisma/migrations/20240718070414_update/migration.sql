/*
  Warnings:

  - You are about to drop the column `pending_friends` on the `user` table. All the data in the column will be lost.
  - Added the required column `sender_image` to the `GroupChat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_name` to the `GroupChat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupChat" ADD COLUMN     "sender_image" TEXT NOT NULL,
ADD COLUMN     "sender_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "pending_friends";
