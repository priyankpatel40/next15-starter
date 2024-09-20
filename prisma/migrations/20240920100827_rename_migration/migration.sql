
-- AlterTable
ALTER TABLE "Account" 
  RENAME COLUMN "expires_at" TO "expiresAt";

ALTER TABLE "Account" 
  RENAME COLUMN "access_token" TO "accessToken";

ALTER TABLE "Account" 
  RENAME COLUMN "id_token" TO "idToken";

ALTER TABLE "Account" 
  RENAME COLUMN "refresh_token" TO "refreshToken";

ALTER TABLE "Account" 
  RENAME COLUMN "session_state" TO "sessionState";

ALTER TABLE "Account" 
  RENAME COLUMN "token_type" TO "tokenType";


-- AlterTable
ALTER TABLE "Company" 
  RENAME COLUMN "api_key" TO "apiKey";

ALTER TABLE "Company"
  RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "Company"
  RENAME COLUMN "created_by" TO "createdBy";

ALTER TABLE "Company"
  RENAME COLUMN "expire_date" TO "expireDate";

ALTER TABLE "Company"
  RENAME COLUMN "is_active" TO "isActive";

ALTER TABLE "Company"
  RENAME COLUMN "is_deleted" TO "isDeleted";

ALTER TABLE "Company"
  RENAME COLUMN "is_pending" TO "isPending";

ALTER TABLE "Company"
  RENAME COLUMN "is_trial" TO "isTrial";

ALTER TABLE "Company"
  RENAME COLUMN "owner_id" TO "ownerId";

ALTER TABLE "Company"
  RENAME COLUMN "updated_at" TO "updatedAt";


-- AlterTable
ALTER TABLE "LoginActivity" 
  RENAME COLUMN "browser_version" TO "browserVersion";

ALTER TABLE "LoginActivity"
  RENAME COLUMN "device_vendor" TO "deviceVendor";

ALTER TABLE "LoginActivity"
  RENAME COLUMN "logged_in" TO "loggedIn";

ALTER TABLE "LoginActivity"
  RENAME COLUMN "logged_out" TO "loggedOut";

ALTER TABLE "LoginActivity"
  RENAME COLUMN "os_version" TO "osVersion";


-- AlterTable
ALTER TABLE "Subscription" 
  RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "Subscription"
  RENAME COLUMN "expires_at" TO "expiresAt";

ALTER TABLE "Subscription"
  RENAME COLUMN "is_active" TO "isActive";

ALTER TABLE "Subscription"
  RENAME COLUMN "updated_at" TO "updatedAt";


-- AlterTable
ALTER TABLE "User" 
  RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "User"
  RENAME COLUMN "created_by" TO "createdBy";

ALTER TABLE "User"
  RENAME COLUMN "is_active" TO "isActive";

ALTER TABLE "User"
  RENAME COLUMN "is_deleted" TO "isDeleted";
