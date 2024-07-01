/*
  Warnings:

  - You are about to drop the column `recevier_id` on the `chats` table. All the data in the column will be lost.
  - Added the required column `receiver_id` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chats" DROP COLUMN "recevier_id",
ADD COLUMN     "receiver_id" TEXT NOT NULL;
