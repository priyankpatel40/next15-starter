/*
  Warnings:

  - You are about to drop the column `access_token` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" 

ALTER COLUMN "accessToken" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "apiKey" DROP NOT NULL;
