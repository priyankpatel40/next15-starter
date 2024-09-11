-- AlterTable
ALTER TABLE "LoginActivity" ADD COLUMN     "browser" TEXT,
ADD COLUMN     "cpu" TEXT,
ADD COLUMN     "device" TEXT,
ADD COLUMN     "isMobile" BOOLEAN,
ADD COLUMN     "os" TEXT;
