-- AlterTable
ALTER TABLE "User" ADD COLUMN     "evaluationLimit" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verifiedDate" TIMESTAMP(3);
