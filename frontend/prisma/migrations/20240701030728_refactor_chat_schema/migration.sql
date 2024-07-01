/*
  Warnings:

  - You are about to drop the column `receiverId` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `chats` table. All the data in the column will be lost.
  - Added the required column `recevier_id` to the `chats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_userId_fkey";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "receiverId",
DROP COLUMN "senderId",
DROP COLUMN "userId",
ADD COLUMN     "recevier_id" TEXT NOT NULL,
ADD COLUMN     "sender_id" TEXT NOT NULL;
