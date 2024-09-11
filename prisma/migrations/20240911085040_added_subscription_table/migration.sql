-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "cid" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_cid_key" ON "Subscription"("cid");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_cid_fkey" FOREIGN KEY ("cid") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
