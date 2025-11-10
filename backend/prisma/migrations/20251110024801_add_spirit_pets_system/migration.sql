-- AlterTable
ALTER TABLE "users" ADD COLUMN     "stars" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "spirit_pets" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "base_name_vi" TEXT NOT NULL,
    "max_stars" INTEGER NOT NULL DEFAULT 5,
    "levels" JSONB NOT NULL,
    "theme" TEXT,
    "color" TEXT,
    "special_effect" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spirit_pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_spirit_pets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "spirit_pet_id" TEXT NOT NULL,
    "current_level" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "unlocked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_upgraded_at" TIMESTAMP(3),

    CONSTRAINT "user_spirit_pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "star_transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "star_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "spirit_pets_code_key" ON "spirit_pets"("code");

-- CreateIndex
CREATE INDEX "spirit_pets_is_active_idx" ON "spirit_pets"("is_active");

-- CreateIndex
CREATE INDEX "spirit_pets_code_idx" ON "spirit_pets"("code");

-- CreateIndex
CREATE INDEX "user_spirit_pets_user_id_idx" ON "user_spirit_pets"("user_id");

-- CreateIndex
CREATE INDEX "user_spirit_pets_spirit_pet_id_idx" ON "user_spirit_pets"("spirit_pet_id");

-- CreateIndex
CREATE INDEX "user_spirit_pets_user_id_is_active_idx" ON "user_spirit_pets"("user_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "user_spirit_pets_user_id_spirit_pet_id_key" ON "user_spirit_pets"("user_id", "spirit_pet_id");

-- CreateIndex
CREATE INDEX "star_transactions_user_id_idx" ON "star_transactions"("user_id");

-- CreateIndex
CREATE INDEX "star_transactions_user_id_created_at_idx" ON "star_transactions"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "user_spirit_pets" ADD CONSTRAINT "user_spirit_pets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_spirit_pets" ADD CONSTRAINT "user_spirit_pets_spirit_pet_id_fkey" FOREIGN KEY ("spirit_pet_id") REFERENCES "spirit_pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "star_transactions" ADD CONSTRAINT "star_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
