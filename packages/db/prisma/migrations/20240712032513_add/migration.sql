-- AlterTable
ALTER TABLE "user" ADD COLUMN     "pending_friends" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "friends" SET DEFAULT ARRAY[]::TEXT[];
