-- AlterTable
ALTER TABLE "users" ADD COLUMN     "coins" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "album_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "image_file" TEXT,
    "price" INTEGER NOT NULL,
    "description" TEXT,
    "unlock_type" TEXT NOT NULL DEFAULT 'coins',
    "unlock_condition" JSONB,
    "downloadable" BOOLEAN NOT NULL DEFAULT false,
    "download_file" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "album_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_album_items" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "album_item_id" TEXT NOT NULL,
    "purchased_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "purchased_with" INTEGER NOT NULL,

    CONSTRAINT "user_album_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coin_transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coin_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "album_items_category_idx" ON "album_items"("category");

-- CreateIndex
CREATE INDEX "album_items_is_active_idx" ON "album_items"("is_active");

-- CreateIndex
CREATE INDEX "album_items_unlock_type_idx" ON "album_items"("unlock_type");

-- CreateIndex
CREATE INDEX "user_album_items_user_id_idx" ON "user_album_items"("user_id");

-- CreateIndex
CREATE INDEX "user_album_items_album_item_id_idx" ON "user_album_items"("album_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_album_items_user_id_album_item_id_key" ON "user_album_items"("user_id", "album_item_id");

-- CreateIndex
CREATE INDEX "coin_transactions_user_id_idx" ON "coin_transactions"("user_id");

-- CreateIndex
CREATE INDEX "coin_transactions_user_id_created_at_idx" ON "coin_transactions"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "user_album_items" ADD CONSTRAINT "user_album_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_album_items" ADD CONSTRAINT "user_album_items_album_item_id_fkey" FOREIGN KEY ("album_item_id") REFERENCES "album_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coin_transactions" ADD CONSTRAINT "coin_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
