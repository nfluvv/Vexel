/*
  Warnings:

  - The values [PUBLISHED] on the enum `DeckStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DeckStatus_new" AS ENUM ('DRAFT', 'PRIVATE', 'PUBLIC');
ALTER TABLE "public"."decks" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "decks" ALTER COLUMN "status" TYPE "DeckStatus_new" USING ("status"::text::"DeckStatus_new");
ALTER TYPE "DeckStatus" RENAME TO "DeckStatus_old";
ALTER TYPE "DeckStatus_new" RENAME TO "DeckStatus";
DROP TYPE "public"."DeckStatus_old";
ALTER TABLE "decks" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterTable
ALTER TABLE "decks" ADD COLUMN     "publishedAt" TIMESTAMP(3);
