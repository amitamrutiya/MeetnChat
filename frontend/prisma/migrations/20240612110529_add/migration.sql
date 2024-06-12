-- AlterTable
ALTER TABLE "users" ALTER COLUMN "phone_number" DROP NOT NULL,
ALTER COLUMN "phone_number" SET DEFAULT '0000000000';
