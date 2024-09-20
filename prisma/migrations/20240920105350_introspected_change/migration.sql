/*
  Warnings:

  - You are about to drop the column `company_name` on the `Company` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[companyName]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyName` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Company_company_name_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "company_name",
ADD COLUMN     "companyName" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Company_companyName_key" ON "Company"("companyName");
