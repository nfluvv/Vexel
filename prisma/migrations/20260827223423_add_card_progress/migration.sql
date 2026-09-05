-- CreateTable
CREATE TABLE "card_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 0,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "dueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "card_progress_userId_dueDate_idx" ON "card_progress"("userId", "dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "card_progress_userId_cardId_key" ON "card_progress"("userId", "cardId");

-- AddForeignKey
ALTER TABLE "card_progress" ADD CONSTRAINT "card_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_progress" ADD CONSTRAINT "card_progress_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
