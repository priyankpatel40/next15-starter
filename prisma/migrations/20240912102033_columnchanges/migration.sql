/*
  Warnings:

  - Made the column `stripeSubscriptionId` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "stripeSubscriptionId" SET NOT NULL,
ALTER COLUMN "expires_at" DROP NOT NULL;
