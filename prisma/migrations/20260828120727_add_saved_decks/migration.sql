-- CreateTable
CREATE TABLE "saved_decks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_decks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "saved_decks_userId_savedAt_idx" ON "saved_decks"("userId", "savedAt");

-- CreateIndex
CREATE UNIQUE INDEX "saved_decks_userId_deckId_key" ON "saved_decks"("userId", "deckId");

-- AddForeignKey
ALTER TABLE "saved_decks" ADD CONSTRAINT "saved_decks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_decks" ADD CONSTRAINT "saved_decks_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
