/*
  Warnings:

  - The primary key for the `verificationtokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `verificationtokens` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `verificationtokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "verificationtokens" DROP CONSTRAINT "verificationtokens_pkey",
DROP COLUMN "email",
DROP COLUMN "id";

-- CreateTable
CREATE TABLE "AccountVerificationToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountVerificationToken_token_key" ON "AccountVerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "AccountVerificationToken_email_token_key" ON "AccountVerificationToken"("email", "token");
